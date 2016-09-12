import 'whatwg-fetch';

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import io from 'socket.io-client';
import {Observable} from 'rxjs';

import {Message} from './models/Message';
import {MessagesStore} from './stores/MessagesStore';
import {SubscriptionsStore} from './stores/SubscriptionsStore';
import {onConnect, onError, onReconnectAttempt, onReconnect, onReconnectError, onReconnectFailed, onMessage, onDisconnect} from './ConnectionListeners';

let messagesStore:MessagesStore = MessagesStore.getInstance();
let subscriptionsStore:SubscriptionsStore = SubscriptionsStore.getInstance();

let _instance:TingClient = null;

class SingletonEnforcer {}

export class TingClient extends EventEmitter
{
    private _transport:SocketIOClient.Socket;

    private _serviceBaseURL:string = '';
    private _userId:string = '';

    constructor(serviceBaseURL:string, userId:string)
    {
        super();
        this._serviceBaseURL = serviceBaseURL;
        this._userId = userId;
    }

    private _authorize(userId:string):Promise<string>
    {
        return fetch(this._serviceBaseURL + '/authorize', {
            method: 'POST',
            body: JSON.stringify({
                userId: this._userId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response:any) =>
        {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                let error = new Error(response.statusText);
                throw error;
            }
        })
        .then((response:any) =>
        {
            return response.token;
        });
    }

    connect():Promise<SocketIOClient.Socket>
    {
        return this._authorize(this._userId)
        .then((token:string) =>
        {
            let liveConnectionPromise = new Promise((resolve, reject) =>
            {
                this._transport = io(this._serviceBaseURL, {
                    path: '/live',
                    query: `token=${token}`
                });

                this._transport.on('connect', () =>
                {
                    onConnect(this._transport);

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
        return subscriptionsStore.subscribedTopics;
    }

    getMessageStreamForTopicName(topicName:string):Observable<Message>
    {
        return messagesStore.getMessageStreamForTopicName(topicName);
    }
}
