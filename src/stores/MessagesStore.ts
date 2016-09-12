import _ from 'lodash';
import {Observable, ReplaySubject} from 'rxjs';
import {Message} from '../models/Message';
import {Topic} from '../models/Topic';

export class MessagesStore
{
    private _messages:ReplaySubject<Message> = new ReplaySubject<Message>();
    get messages():ReplaySubject<Message>
    {
        return this._messages;
    }

    constructor()
    {
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