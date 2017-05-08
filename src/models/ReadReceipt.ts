import { Moment } from 'moment';

export interface IIncomingReadReceipt
{
    messageId: string;
    subscriber: string;
    readOn: Moment;
}

export class ReadReceipt
{
    messageId: string = '';
    subscriber: string = '';
    readOn: Moment = null;

    constructor(data: IIncomingReadReceipt)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }
    }
}