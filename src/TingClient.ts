import 'whatwg-fetch';

import _ from 'lodash';
import EventEmitter from 'eventemitter3';
import io from 'socket.io-client';

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

    connect():Promise<string>
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
                    this._transport.on('disconnect', () =>
                    {
                    });

                    this._transport.on('error', (error) =>
                    {
                    });

                    this._transport.on('message', function(data)
                    {
                        console.info('message');
                        console.log(data);
                    });

                    resolve(this._transport.id);
                });

                this._transport.once('error', (error) =>
                {
                    reject(error);
                });
            });

            return <Promise<string>> liveConnectionPromise;
        });
    }
}
