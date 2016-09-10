import _ from 'lodash';
import {Observable, BehaviorSubject} from 'rxjs';
import {Topic} from '../models/Topic';

let _instance:SubscriptionsStore = null;

class SingletonEnforcer {}

export class SubscriptionsStore
{
    private _subscribedTopics:Array<Topic> = new Array<Topic>();
    get subscribedTopics():Array<Topic>
    {
        return this._subscribedTopics;
    }

    private _subscribedTopicsObservable:BehaviorSubject<Array<Topic>> = new BehaviorSubject<Array<Topic>>(this.subscribedTopics);
    get subscribedTopicsObservable():BehaviorSubject<Array<Topic>>
    {
        return this._subscribedTopicsObservable;
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
        this.subscribedTopics.push(topic);
        this.subscribedTopicsObservable.next(this.subscribedTopics);
    }

    getTopicForName(topicName:string):Promise<Topic>
    {
        return new Promise((resolve, reject) =>
        {
            resolve(_.find(this.subscribedTopics, (datum:Topic) =>
            {
                return datum.name === topicName;
            }));
        });
    }
}