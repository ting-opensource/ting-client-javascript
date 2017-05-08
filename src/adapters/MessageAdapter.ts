import * as moment from 'moment';
import * as _ from 'lodash';

import { IIncomingMessage, Message } from '../models/Message';
import { IFileMetadata, FileMetadata } from '../models/FileMetadata';
import { MessageTypes } from '../models/MessageTypes';
import { TopicAdapter } from './TopicAdapter';

export class MessageAdapter
{
    static fileMetadataFromServerResponse(fileMetadataData: IFileMetadata): FileMetadata
    {
        return new FileMetadata(_.extend({}, fileMetadataData, {
            createdAt: fileMetadataData.createdAt ? moment.utc(fileMetadataData.createdAt) : null,
            updatedAt: fileMetadataData.updatedAt ? moment.utc(fileMetadataData.updatedAt) : null,
        }));
    }

    static fromServerResponse(messageData: IIncomingMessage): Message
    {
        let messageBody: any = '';
        let type: string = messageData.type;

        try
        {
            if(messageData.type === MessageTypes.JSON)
            {
                messageBody = JSON.parse(messageData.body);
            }
            else if(messageData.type === MessageTypes.FILE)
            {
                let fileMetadataData: any = JSON.parse(messageData.body);
                messageBody = MessageAdapter.fileMetadataFromServerResponse(fileMetadataData);
            }
            else
            {
                messageBody = messageData.body;
            }
        }
        catch(error)
        {
            messageBody = messageData.body;
            type = MessageTypes.TEXT;
        }

        let message: Message = new Message(<IIncomingMessage>_.extend({}, messageData, {
            type: type,
            body: messageBody,
            topic: TopicAdapter.fromServerResponse(messageData.topic),
            createdAt: messageData.createdAt ? moment.utc(messageData.createdAt) : null,
            updatedAt: messageData.updatedAt ? moment.utc(messageData.updatedAt) : null,
            readOn: messageData.readOn ? moment.utc(messageData.updatedAt) : null,
        }));

        return message;
    }
}