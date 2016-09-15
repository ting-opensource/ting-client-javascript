import moment from 'moment';
import {BehaviorSubject} from 'rxjs';

import {Message} from './Message';

const BUFFER_SIZE:number = 999;

export interface IIncomingTopic
{
    topicId?:string;
    name:string;
    isActive:boolean;
    createdBy?:string;
    createdAt?:moment.MomentStatic;
    updatedBy?:string;
    updatedAt?:moment.MomentStatic;
}

export class Topic
{
    topicId:string = '';
    name:string = '';
    isActive:boolean = false;
    createdBy:string = '';
    createdAt:moment.MomentStatic = null;
    updatedBy:string = '';
    updatedAt:moment.MomentStatic = null;
    messages:BehaviorSubject<Array<Message>> = new BehaviorSubject<Array<Message>>([]);

    constructor(data:IIncomingTopic)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }

    addMessage(message:Message)
    {
        let messages:Array<Message> = this.messages.getValue();
        messages.push(message);
        this.messages.next(messages);
    }
}