import 'whatwg-fetch';

import * as _ from 'lodash';
import * as EventEmitter from 'eventemitter3';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs';

import {Session} from './models/Session';
import {Topic} from './models/Topic';
import {Subscription} from './models/Subscription';
import {Message} from './models/Message';
import {AuthenticationService} from './services/AuthenticationService';
import {SubscriptionsStore} from './stores/SubscriptionsStore';
import {onConnect} from './ConnectionListeners';

let _instance:TingClient = null;

class SingletonEnforcer {}

export class TingClient extends EventEmitter
{
    private _transport:SocketIOClient.Socket;
    private _session:Session;
    get session():Session
    {
        return this._session;
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

    connect():Promise<SocketIOClient.Socket>
    {
        return AuthenticationService.authenticateSession(this._session)
        .then((session:Session) =>
        {
            let liveConnectionPromise = new Promise((resolve, reject) =>
            {
                this._transport = io(this._serviceBaseURL, {
                    path: '/live',
                    query: `token=${session.token}`
                });

                this._transport.on('connect', () =>
                {
                    onConnect(this._transport, this, this._subscriptionsStore);

                    resolve(this._transport);
                });

                this._transport.once('error', (error) =>
                {
                    reject(error);
                });
            });

            return <Promise<SocketIOClient.Socket>> liveConnectionPromise;
        });
    }

    getSubscribedTopics():Observable<Array<Topic>>
    {
        return this._subscriptionsStore.subscribedTopics;
    }

    getSubscribedTopicByName(topicName:string):Topic
    {
        return this._subscriptionsStore.getTopicForName(topicName);
    }

    subscribeToTopicByName(topicName:string):Promise<Subscription>
    {
        return this._subscriptionsStore.subscribeToTopicByName(topicName);
    }

    unsubscribeFromTopic(topic:Topic):Promise<Subscription>
    {
        return this._subscriptionsStore.unsubscribeFromTopic(topic);
    }

    getMessageStreamForTopicName(topicName:string):Observable<Message[]>
    {
        return this._subscriptionsStore.getMessageStreamForTopicName(topicName);
    }

    getMessageStreamForTopic(topic:Topic):Observable<Message[]>
    {
        return this._subscriptionsStore.getMessageStreamForTopic(topic);
    }

    fetchMessagesForTopicSinceMessage(topic:Topic, sinceMessage:Message):Promise<Array<Message>>
    {
        return this._subscriptionsStore.fetchMessagesForTopicSinceMessage(topic, sinceMessage);
    }

    fetchMessagesForTopicTillMessage(topic:Topic, tillMessage:Message):Promise<Array<Message>>
    {
        return this._subscriptionsStore.fetchMessagesForTopicTillMessage(topic, tillMessage);
    }
}
