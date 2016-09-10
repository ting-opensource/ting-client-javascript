import moment from 'moment/moment';

import {MessageTypes} from './MessageTypes';
import {Topic} from './Topic';

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

    constructor()
    {
    }
}