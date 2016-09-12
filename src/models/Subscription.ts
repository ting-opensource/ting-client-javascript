'use strict';

import {IIncomingTopic, Topic} from './Topic';

export interface IIncomingSubscription
{
    subscriptionId?:string;
    topic:IIncomingTopic;
    subscriber:string;
    isDurable:boolean;
    isActive:boolean;
    createdAt?:moment.MomentStatic;
    updatedAt?:moment.MomentStatic;
}

export class Subscription 
{
    subscriptionId:string = '';
    topic:Topic = null;
    subscriber:string = '';
    isDurable:boolean = false;
    isActive:boolean = false;
    createdAt:moment.MomentStatic = null;
    updatedAt:moment.MomentStatic = null;

    constructor(data:IIncomingSubscription)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }
}
