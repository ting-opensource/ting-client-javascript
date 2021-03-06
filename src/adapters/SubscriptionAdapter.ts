import * as moment from 'moment';
import { extend } from 'lodash';

import { IIncomingSubscription, Subscription } from '../models/Subscription';
import { TopicAdapter } from './TopicAdapter';

export class SubscriptionAdapter
{
    static fromServerResponse(subscriptionData: IIncomingSubscription): Subscription
    {
        let subscription: Subscription = new Subscription(<IIncomingSubscription>extend({}, subscriptionData, {
            topic: TopicAdapter.fromServerResponse(subscriptionData.topic),
            createdAt: subscriptionData.createdAt ? moment.utc(subscriptionData.createdAt) : null,
            updatedAt: subscriptionData.updatedAt ? moment.utc(subscriptionData.updatedAt) : null
        }));

        return subscription;
    }
}