import * as moment from 'moment';
import * as _ from 'lodash';

import { IIncomingReadReceipt, ReadReceipt } from '../models/ReadReceipt';
import { TopicAdapter } from './TopicAdapter';

export class ReadReceiptAdapter
{
    static fromServerResponse(readReceiptData: IIncomingReadReceipt): ReadReceipt
    {
        let readReceipt: ReadReceipt = new ReadReceipt(<IIncomingReadReceipt>_.extend({}, readReceiptData, {
            readOn: readReceiptData.readOn ? moment.utc(readReceiptData.readOn) : null,
        }));

        return readReceipt;
    }
}