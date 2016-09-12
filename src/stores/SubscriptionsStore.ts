import _ from 'lodash';
import {Observable, BehaviorSubject} from 'rxjs';
import {Topic} from '../models/Topic';

let _instance:SubscriptionsStore = null;

class SingletonEnforcer {}

export class SubscriptionsStore
{
    private _subscribedTopics:BehaviorSubject<Array<Topic>> = new BehaviorSubject<Array<Topic>>([]);
    get subscribedTopics():BehaviorSubject<Array<Topic>>
    {
        return this._subscribedTopics;
    }

    constructor(enforcer:SingletonEnforcer)
    {
        if(!enforcer || !(enforcer instanceof SingletonEnforcer))
        {
            throw new Error(`This is a Singleton Class. Use getInstance() method instead.`);
        }
    }

    static getInstance()
    {
        if(!_instance)
        {
            _instance = new SubscriptionsStore(new SingletonEnforcer());
        }

        return _instance;
    }

    addSubscribedTopic(topic:Topic)
    {
        let subscribedTopicsArray:Array<Topic> = this.subscribedTopics.getValue();
        subscribedTopicsArray.push(topic);
        this.subscribedTopics.next(subscribedTopicsArray);
    }

    removeSubscribedTopicById(topicId:string)
    {
        let subscribedTopicsArray:Array<Topic> = this.subscribedTopics.getValue();
        let matchedTopic:Topic = _.find(subscribedTopicsArray, (datum:Topic) =>
        {
            return datum.topicId === topicId;
        });
        let matchedTopicIndex = _.indexOf(subscribedTopicsArray, matchedTopic);
        if(matchedTopicIndex >= 0)
        {
            subscribedTopicsArray.splice(matchedTopicIndex, 1);
        }
        this.subscribedTopics.next(subscribedTopicsArray);
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
}