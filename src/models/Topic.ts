import moment from 'moment';
import {ReplaySubject} from 'rxjs';

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
    messages:ReplaySubject<Message> = new ReplaySubject<Message>(BUFFER_SIZE);

    constructor(data:IIncomingTopic)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }

        this.messages.subscribe((message) =>
        {
            console.log(message);
        });
    }

    addMessage(message:Message)
    {
        this.messages.next(message);
    }
}