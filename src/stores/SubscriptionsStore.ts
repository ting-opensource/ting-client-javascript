import _ from 'lodash';
import {Observable, BehaviorSubject} from 'rxjs';

import {TingClient} from '../TingClient';
import {Topic} from '../models/Topic';
import {Subscription} from '../models/Subscription';
import {Message} from '../models/Message';
import {SubscriptionService} from '../services/SubscriptionService';
import {MessagesService} from '../services/MessagesService';

export class SubscriptionsStore
{
    private _client:TingClient = null;

    private _subscribedTopics:BehaviorSubject<Array<Topic>> = new BehaviorSubject<Array<Topic>>([]);
    get subscribedTopics():BehaviorSubject<Array<Topic>>
    {
        return this._subscribedTopics;
    }

    constructor(client:TingClient)
    {
        this._client = client;
    }

    subscribeToTopicByName(topicName:string):Promise<Subscription>
    {
        return SubscriptionService.subscribeToTopicByName(this._client.session, topicName);
    }

    unsubscribeFromTopic(topic:Topic):Promise<Subscription>
    {
        return SubscriptionService.unsubscribeFromTopic(this._client.session, topic);
    }

    addSubscribedTopic(topic:Topic):BehaviorSubject<Array<Topic>>
    {
        let subscribedTopicsArray:Array<Topic> = this.subscribedTopics.getValue();
        let matchedTopic:Topic = _.find(subscribedTopicsArray, (datum:Topic) =>
        {
            return datum.topicId === topic.topicId;
        });

        if(matchedTopic)
        {
            _.extend(matchedTopic, _.omit(topic, 'messages'));
        }
        else
        {
            subscribedTopicsArray.push(topic);
        }

        this.subscribedTopics.next(subscribedTopicsArray);
        return this.subscribedTopics;
    }

    removeSubscribedTopicById(topicId:string):BehaviorSubject<Array<Topic>>
    {
        let subscribedTopicsArray:Array<Topic> = this.subscribedTopics.getValue();
        let matchedTopic:Topic = _.find(subscribedTopicsArray, (datum:Topic) =>
        {
            return datum.topicId === topicId;
        });

        if(matchedTopic)
        {
            let matchedTopicIndex = _.indexOf(subscribedTopicsArray, matchedTopic);
            subscribedTopicsArray.splice(matchedTopicIndex, 1);
            matchedTopic.messages.complete();
        }

        this.subscribedTopics.next(subscribedTopicsArray);
        return this.subscribedTopics;
    }

    getTopicForName(topicName:string):Topic
    {
        let subscribedTopicsArray:Array<Topic> = this.subscribedTopics.getValue();
        let matchedTopic:Topic = _.find(subscribedTopicsArray, (datum:Topic) =>
        {
            return datum.name === topicName;
        });

        return matchedTopic || null;
    }

    getMessageStreamForTopic(topic:Topic):Observable<Array<Message>>
    {
        return topic.messages;
    }

    getMessageStreamForTopicName(topicName:string):Observable<Array<Message>>
    {
        let matchingTopic:Topic = this.getTopicForName(topicName);

        if(matchingTopic)
        {
            return matchingTopic.messages;
        }
        else
        {
            throw new Error(`topic with name ${topicName} not yet subscribed!`);
        }
    }

    fetchMessagesForTopicSinceMessage(topic:Topic, sinceMessage:Message):Promise<Array<Message>>
    {
        return MessagesService.fetchMessagesForTopicSinceMessage(this._client.session, topic, sinceMessage)
        .then((messages:Array<Message>) =>
        {
            topic.mergeMessages(messages);
            return messages;
        });
    }

    fetchMessagesForTopicTillMessage(topic:Topic, tillMessage:Message):Promise<Array<Message>>
    {
        return MessagesService.fetchMessagesForTopicTillMessage(this._client.session, topic, tillMessage)
        .then((messages:Array<Message>) =>
        {
            topic.mergeMessages(messages);
            return messages;
        });
    }
}