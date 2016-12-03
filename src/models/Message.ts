import {Moment} from 'moment';
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
    subscriber:string;
    readOn:Moment;
}

export class Message
{
    messageId:string = '';
    topic:Topic = null;
    publisher:string = '';
    type:string = MessageTypes.TEXT;
    body:Object|string = '';
    createdAt:Moment = null;
    updatedBy:string = '';
    updatedAt:Moment = null;
    subscriber:string = '';
    readOn:Moment = null;

    constructor(data:IIncomingMessage)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }

    get isRead()
    {
        return this.readOn === null ? false : true;
    }
}