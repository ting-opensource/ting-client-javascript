import 'whatwg-fetch';

import * as _ from 'lodash';
import * as EventEmitter from 'eventemitter2';
import * as io from 'socket.io-client';
import {Observable, BehaviorSubject} from 'rxjs';

import {Session} from './models/Session';
import {Topic} from './models/Topic';
import {Subscription} from './models/Subscription';
import {Message} from './models/Message';
import {AuthenticationService} from './services/AuthenticationService';
import {MessagesService} from './services/MessagesService';
import {SubscriptionsStore} from './stores/SubscriptionsStore';
import {onConnect} from './ConnectionListeners';

import {SocketConnectionEvents} from './models/SocketConnectionEvents';
import {ConnectionStatuses} from './models/ConnectionStatuses';
import {TingEvents} from './models/TingEvents';

let _instance:TingClient = null;

class SingletonEnforcer {}

export class TingClient extends EventEmitter.EventEmitter2
{
    public static get ConnectionStatuses():ConnectionStatuses
    {
        return ConnectionStatuses;
    }

    public static get SocketConnectionEvents():SocketConnectionEvents
    {
        return SocketConnectionEvents;
    }

    public static get TingEvents():TingEvents
    {
        return TingEvents;
    }

    private _transport:SocketIOClient.Socket;
    get transport():SocketIOClient.Socket
    {
        return this._transport;
    }

    private _session:Session;
    get session():Session
    {
        return this._session;
    }

    private _connectionStatus:BehaviorSubject<string> = new BehaviorSubject(ConnectionStatuses.DISCONNECTED);
    get connectionStatus():BehaviorSubject<string>
    {
        return this._connectionStatus;
    }

    private _isConnected:BehaviorSubject<boolean> = new BehaviorSubject(false);
    get isConnected():BehaviorSubject<boolean>
    {
        return this._isConnected;
    }

    private _serviceBaseURL:string = '';
    private _userId:string = '';
    private _clientId:string = '';
    private _clientSecret:string = '';

    private _subscriptionsStore:SubscriptionsStore;

    constructor(serviceBaseURL:string, userId:string, clientId:string, clientSecret:string)
    {
        super();
        this._serviceBaseURL = serviceBaseURL;
        this._userId = userId;
        this._clientId = clientId;
        this._clientSecret = clientSecret;

        this._session = new Session(serviceBaseURL, userId, clientId, clientSecret);

        this._subscriptionsStore = new SubscriptionsStore(this);
    }

    // Protected Method. Should not be called from public interface
    public __setConnectionStatus(latestConnectionStatus:string):void
    {
        this._connectionStatus.next(latestConnectionStatus);

        if(latestConnectionStatus === ConnectionStatuses.CONNECTED)
        {
            this._isConnected.next(true);
        }
        else
        {
            this._isConnected.next(false);
        }
    }

    public connect():Promise<SocketIOClient.Socket>
    {
        this.__setConnectionStatus(ConnectionStatuses.CONNECTING);

        return AuthenticationService.authenticateSession(this._session)
        .then((session:Session) =>
        {
            let liveConnectionPromise = new Promise((resolve, reject) =>
            {
                this._transport = io(this._serviceBaseURL, {
                    path: '/live',
                    query: `token=${session.token}`
                });

                let onSocketConnect:Function = () =>
                {
                    onConnect(this._transport, this, this._subscriptionsStore);

                    this._transport.off(SocketConnectionEvents.ERROR, onSocketConnectError);
                    this.__setConnectionStatus(ConnectionStatuses.CONNECTED);

                    resolve(this._transport);
                };

                let onSocketConnectError:Function = (error) =>
                {
                    this._transport.off(SocketConnectionEvents.CONNECT, onSocketConnect);
                    this.__setConnectionStatus(ConnectionStatuses.ERRORED);

                    reject(error);
                };

                this._transport.once(SocketConnectionEvents.CONNECT, onSocketConnect);
                this._transport.once(SocketConnectionEvents.ERROR, onSocketConnectError);
            });

            return <Promise<SocketIOClient.Socket>> liveConnectionPromise;
        });
    }

    public disconnect():void
    {
        this.transport.disconnect();
        this._subscriptionsStore.reset();
    }

    public getSubscribedTopics():Observable<Array<Topic>>
    {
        return this._subscriptionsStore.subscribedTopics;
    }

    public getSubscribedTopicByName(topicName:string):Topic
    {
        return this._subscriptionsStore.getTopicForName(topicName);
    }

    public subscribeToTopicByName(topicName:string):Promise<Subscription>
    {
        return this._subscriptionsStore.subscribeToTopicByName(topicName);
    }

    public unsubscribeFromTopic(topic:Topic):Promise<Subscription>
    {
        return this._subscriptionsStore.unsubscribeFromTopic(topic);
    }

    public getMessageStreamForTopicName(topicName:string):Observable<Message[]>
    {
        return this._subscriptionsStore.getMessageStreamForTopicName(topicName);
    }

    public getMessageStreamForTopic(topic:Topic):Observable<Message[]>
    {
        return this._subscriptionsStore.getMessageStreamForTopic(topic);
    }

    public fetchMessagesForTopicSinceMessage(topic:Topic, sinceMessage:Message):Promise<Array<Message>>
    {
        return this._subscriptionsStore.fetchMessagesForTopicSinceMessage(topic, sinceMessage);
    }

    public fetchMessagesForTopicTillMessage(topic:Topic, tillMessage:Message):Promise<Array<Message>>
    {
        return this._subscriptionsStore.fetchMessagesForTopicTillMessage(topic, tillMessage);
    }

    public publishMessage(topicName:string, messageBody:string, messageType:string):Promise<Message>
    {
        return MessagesService.publishMessage(this.session, topicName, messageBody, messageType);
    }

    public markAMessageAsRead(message:Message):Promise<Observable<Array<Message>>>
    {
        return this._subscriptionsStore.markAMessageAsRead(message);
    }

    public markMessagesTillAMessageAsRead(tillMessage:Message):Promise<Observable<Array<Message>>>
    {
        return this._subscriptionsStore.markMessagesTillAMessageAsRead(tillMessage);
    }

    public markMessagesSinceAMessageAsRead(sinceMessage:Message):Promise<Observable<Array<Message>>>
    {
        return this._subscriptionsStore.markMessagesSinceAMessageAsRead(sinceMessage);
    }
}
