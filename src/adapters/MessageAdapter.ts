import * as moment from 'moment';
import * as _ from 'lodash';

import {IIncomingMessage, Message} from '../models/Message';
import {TopicAdapter} from './TopicAdapter';

export class MessageAdapter
{
    static fromServerResponse(messageData:IIncomingMessage):Message
    {
        let message:Message = new Message(<IIncomingMessage> _.extend({}, messageData, {
            topic: TopicAdapter.fromServerResponse(messageData.topic),
            createdAt: messageData.createdAt ? moment.utc(messageData.createdAt) : null,
            updatedAt: messageData.updatedAt ? moment.utc(messageData.updatedAt) : null
        }));

        return message;
    }
}