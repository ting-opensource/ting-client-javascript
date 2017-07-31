import * as moment from 'moment';
import { extend } from 'lodash';

import { IIncomingReadReceipt, ReadReceipt } from '../models/ReadReceipt';
import { TopicAdapter } from './TopicAdapter';

export class ReadReceiptAdapter
{
    static fromServerResponse(readReceiptData: IIncomingReadReceipt): ReadReceipt
    {
        let readReceipt: ReadReceipt = new ReadReceipt(<IIncomingReadReceipt>extend({}, readReceiptData, {
            readOn: readReceiptData.readOn ? moment.utc(readReceiptData.readOn) : null,
        }));

        return readReceipt;
    }
}