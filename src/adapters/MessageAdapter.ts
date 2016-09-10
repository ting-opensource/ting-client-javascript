import moment from 'moment';
import _ from 'lodash';

import {IIncomingMessage, Message} from '../models/Message';

export class MessageAdapter
{
    static fromServerResponse(messageData:IIncomingMessage):Message
    {
        let message:Message = new Message(<IIncomingMessage> _.extend({}, messageData, {
            createdAt: messageData.createdAt ? moment.utc(messageData.createdAt) : null,
            updatedAt: messageData.updatedAt ? moment.utc(messageData.updatedAt) : null
        }));

        return message;
    }
}