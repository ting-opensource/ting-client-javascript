import moment from 'moment/moment';

import {MessageTypes} from './MessageTypes';
import {IIncomingTopic, Topic} from './Topic';

export interface IIncomingMessage
{
    messageId:string;
    topic:IIncomingTopic,
    publisher:string;
    type:string;
    body:string;
    createdAt:string;
    updatedAt:string;
}

export class Message
{
    messageId:string = '';
    topic:Topic = null;
    publisher:string = '';
    type:string = MessageTypes.TEXT;
    body:Object|string = '';
    createdAt:moment.MomentStatic = null;
    updatedBy:string = '';
    updatedAt:moment.MomentStatic = null;

    constructor(data:IIncomingMessage)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }
}