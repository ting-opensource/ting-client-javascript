import moment from 'moment/moment';

import {Message} from './Message';

export class Topic
{
    topicId:string = '';
    name:string = '';
    isActive:boolean = false;
    createdBy:string = '';
    createdAt:moment.MomentStatic = null;
    updatedBy:string = '';
    updatedAt:moment.MomentStatic = null;
    messages:Array<Message>;

    constructor()
    {
    }
}