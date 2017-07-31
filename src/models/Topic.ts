import { Moment } from 'moment';
import { chain, unionBy, keyBy, sortBy, keys, forEach, indexOf, extend } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Message } from './Message';
import { ReadReceipt } from './ReadReceipt';

const BUFFER_SIZE: number = 999;

export interface IIncomingTopic
{
    topicId?: string;
    name: string;
    isActive: boolean;
    createdBy?: string;
    createdAt?: Moment;
    updatedBy?: string;
    updatedAt?: Moment;
}

export class Topic
{
    topicId: string = '';
    name: string = '';
    isActive: boolean = false;
    createdBy: string = '';
    createdAt: Moment = null;
    updatedBy: string = '';
    updatedAt: Moment = null;

    private _unreadCountSubscription: Subscription = null;

    private _messages: BehaviorSubject<Array<Message>> = new BehaviorSubject<Array<Message>>([]);
    get messages(): BehaviorSubject<Array<Message>>
    {
        return this._messages;
    }

    private _unreadMessagesCount: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
    get unreadMessagesCount(): BehaviorSubject<number>
    {
        return this._unreadMessagesCount;
    }

    constructor(data: IIncomingTopic)
    {
        for(let key in data)
        {
            this[key] = data[key];
        }

        this._unreadCountSubscription = this._messages.subscribe((messages: Array<Message>) =>
        {
            let unreadMessages = chain(messages).filter((datum: Message) =>
            {
                return !datum.isRead;
            }).value();

            this.unreadMessagesCount.next(unreadMessages.length);
        });
    }

    addMessage(message: Message): BehaviorSubject<Array<Message>>
    {
        return this.mergeMessages([message]);
    }

    mergeMessages(incomingMessages: Array<Message>): BehaviorSubject<Array<Message>>
    {
        let existingMesssages: Array<Message> = this.messages.getValue();
        let mergedMessages: Array<Message> = unionBy(incomingMessages, existingMesssages, 'messageId');

        mergedMessages = sortBy(mergedMessages, (datum: Message) =>
        {
            return -(datum.updatedAt.valueOf());
        });

        this.messages.next(mergedMessages);

        return this.messages;
    }

    markAMessageAsRead(readReceipt: ReadReceipt): BehaviorSubject<Array<Message>>
    {
        return this.markMessagesAsRead([readReceipt]);
    }

    markMessagesAsRead(readReceipts: Array<ReadReceipt>): BehaviorSubject<Array<Message>>
    {
        let existingMesssages: Array<Message> = this.messages.getValue();

        let readReceiptsKeyedByMessageId: any = keyBy(readReceipts, (datum: ReadReceipt) =>
        {
            return datum.messageId;
        });

        let messageIdsInReadReceipts: Array<string> = keys(readReceiptsKeyedByMessageId);

        forEach(existingMesssages, (datum: Message) =>
        {
            if(indexOf(messageIdsInReadReceipts, datum.messageId) > -1)
            {
                extend(datum, readReceiptsKeyedByMessageId[datum.messageId]);
            }
        });

        this.messages.next(existingMesssages);

        return this.messages;
    }

    reset(): void
    {
        this._unreadCountSubscription.unsubscribe();

        this.messages.next([]);
        this.unreadMessagesCount.next(0);
    }
}