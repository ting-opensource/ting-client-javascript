import { Moment } from 'moment';
import { MessageTypes } from './MessageTypes';
import { IIncomingTopic, Topic } from './Topic';

export interface IFileMetadata
{
    key: string;
    originalName: string;
    contentType: string;
    createdAt: Moment;
    updatedAt: Moment;
}

export class FileMetadata
{
    key: string = '';
    originalName: string = '';
    contentType: string = '';
    createdAt: Moment = null;
    updatedAt: Moment = null;

    constructor(data: IFileMetadata)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }
}
