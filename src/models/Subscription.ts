'use strict';

import { Moment } from 'moment';
import { IIncomingTopic, Topic } from './Topic';

export interface IIncomingSubscription
{
    subscriptionId?: string;
    topic: IIncomingTopic;
    subscriber: string;
    isDurable: boolean;
    isActive: boolean;
    createdAt?: Moment;
    updatedAt?: Moment;
}

export class Subscription
{
    subscriptionId: string = '';
    topic: Topic = null;
    subscriber: string = '';
    isDurable: boolean = false;
    isActive: boolean = false;
    createdAt: Moment = null;
    updatedAt: Moment = null;

    constructor(data: IIncomingSubscription)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }
}
