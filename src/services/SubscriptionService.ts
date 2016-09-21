import 'whatwg-fetch';

import {IIncomingSubscription, Subscription} from '../models/Subscription';
import {Session} from '../models/Session';
import {Topic} from '../models/Topic';
import {SubscriptionAdapter} from '../adapters/SubscriptionAdapter';

export class SubscriptionService
{
    static subscribeToTopicByName(session:Session, topicName:string):Promise<Subscription>
    {
        return fetch(`${session.serviceBaseURL}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({
                topic: {
                    name: topicName,
                    createIfNotExist: true
                }
            }),
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
        .then((response:IIncomingSubscription) =>
        {
            return SubscriptionAdapter.fromServerResponse(response);
        });
    }

    static unsubscribeFromTopic(session:Session, topic:Topic):Promise<Subscription>
    {
        return fetch(`${session.serviceBaseURL}/unsubscribe`, {
            method: 'POST',
            body: JSON.stringify({
                topic: {
                    name: topic.name
                }
            }),
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
        .then((response:IIncomingSubscription) =>
        {
            return SubscriptionAdapter.fromServerResponse(response);
        });
    }
}