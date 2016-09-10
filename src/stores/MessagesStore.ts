import _ from 'lodash';
import {Observable, ReplaySubject} from 'rxjs';
import {Message} from '../models/Message';
import {Topic} from '../models/Topic';

let _instance:MessagesStore = null;

class SingletonEnforcer {}

export class MessagesStore
{
    private _messages:ReplaySubject<Message> = new ReplaySubject<Message>();
    get messages():ReplaySubject<Message>
    {
        return this._messages;
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
            _instance = new MessagesStore(new SingletonEnforcer());
        }

        return _instance;
    }

    addMessage(message:Message)
    {
        this.messages.next(message);
    }

    getMessageStreamForTopicName(topicName:string):Observable<Message>
    {
        return this.messages
        .filter((datum:Message) =>
        {
            return datum.topic.name === topicName;
        });
    }
}