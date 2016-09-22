import 'whatwg-fetch';
import * as _ from 'lodash';

import {Topic} from '../models/Topic';
import {Session} from '../models/Session';
import {IIncomingMessage, Message} from '../models/Message';
import {MessageAdapter} from '../adapters/MessageAdapter';

const DEFAULT_PAGE_SIZE:number = 100;

export class MessagesService
{
    static fetchMessagesForTopicSinceMessage(session:Session, topic:Topic, message:Message):Promise<Array<Message>>
    {
        let url:string = `${session.serviceBaseURL}/messages?topic=${encodeURIComponent(topic.name)}&sinceMessageId=${encodeURIComponent(message.messageId)}&pageSize=${encodeURIComponent(DEFAULT_PAGE_SIZE.toString())}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
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
        .then((response:Array<IIncomingMessage>) =>
        {
            return _.map(response, (datum:IIncomingMessage) =>
            {
                return MessageAdapter.fromServerResponse(datum);
            });
        });
    }

    static fetchMessagesForTopicTillMessage(session:Session, topic:Topic, message:Message):Promise<Array<Message>>
    {
        let url:string = `${session.serviceBaseURL}/messages?topic=${encodeURIComponent(topic.name)}&tillMessageId=${encodeURIComponent(message.messageId)}&pageSize=${encodeURIComponent(DEFAULT_PAGE_SIZE.toString())}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
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
        .then((response:Array<IIncomingMessage>) =>
        {
            return _.map(response, (datum:IIncomingMessage) =>
            {
                return MessageAdapter.fromServerResponse(datum);
            });
        });
    }
}