import 'whatwg-fetch';
import * as _ from 'lodash';
import * as queryString from 'query-string';

import {Topic} from '../models/Topic';
import {Session} from '../models/Session';
import {IIncomingMessage, Message} from '../models/Message';
import {MessageAdapter} from '../adapters/MessageAdapter';

export class MessagesService
{
    static fetchMessagesForTopicSinceMessage(session:Session, topic:Topic, message:Message):Promise<Array<Message>>
    {
        let queryStringParams = {
            topic: topic.name,
            sinceMessageId: message.messageId,
            pageSize: 100
        };

        let url:string = `${session.serviceBaseURL}/messages?${queryString.stringify(queryStringParams)}`;

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
        let queryStringParams = {
            topic: topic.name,
            tillMessageId: message.messageId,
            pageSize: 100
        };

        let url:string = `${session.serviceBaseURL}/messages?${queryString.stringify(queryStringParams)}`;

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