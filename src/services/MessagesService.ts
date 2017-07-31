import { map } from 'lodash';
import 'whatwg-fetch';

import { Topic } from '../models/Topic';
import { Session } from '../models/Session';
import { IIncomingMessage, Message } from '../models/Message';
import { IIncomingReadReceipt, ReadReceipt } from '../models/ReadReceipt';
import { MessageTypes } from '../models/MessageTypes';
import { MessageAdapter } from '../adapters/MessageAdapter';
import { ReadReceiptAdapter } from '../adapters/ReadReceiptAdapter';

const DEFAULT_PAGE_SIZE: number = 100;

export class MessagesService
{
    static fetchMessagesForTopicSinceMessage(session: Session, topic: Topic, message: Message): Promise<Array<Message>>
    {
        let url: string = `${session.serviceBaseURL}/messages?topic=${encodeURIComponent(topic.name)}&sinceMessageId=${encodeURIComponent(message.messageId)}&pageSize=${encodeURIComponent(DEFAULT_PAGE_SIZE.toString())}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: Array<IIncomingMessage>) =>
            {
                return map(response, (datum: IIncomingMessage) =>
                {
                    return MessageAdapter.fromServerResponse(datum);
                });
            });
    }

    static fetchMessagesForTopicTillMessage(session: Session, topic: Topic, message: Message): Promise<Array<Message>>
    {
        let url: string = `${session.serviceBaseURL}/messages?topic=${encodeURIComponent(topic.name)}&tillMessageId=${encodeURIComponent(message.messageId)}&pageSize=${encodeURIComponent(DEFAULT_PAGE_SIZE.toString())}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: Array<IIncomingMessage>) =>
            {
                return map(response, (datum: IIncomingMessage) =>
                {
                    return MessageAdapter.fromServerResponse(datum);
                });
            });
    }

    static publishMessage(session: Session, topicName: string, messageBody: string, messageType: string = MessageTypes.TEXT): Promise<Message>
    {
        let url: string = `${session.serviceBaseURL}/messages/publish`;

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({
                topic: {
                    name: topicName,
                    createIfNotExist: true
                },
                message: {
                    type: messageType,
                    body: messageBody
                }
            })
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: IIncomingMessage) =>
            {
                return MessageAdapter.fromServerResponse(response);
            });
    }

    static publishFile(session: Session, topicName: string, file: File): Promise<Message>
    {
        let url: string = `${session.serviceBaseURL}/files`;

        let formData = new FormData();
        formData.append('topicName', topicName);
        formData.append('createTopicIfNotExist', 'true');
        formData.append('file', file);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.token}`
            },
            body: formData
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: IIncomingMessage) =>
            {
                return MessageAdapter.fromServerResponse(response);
            });
    }

    static markAMessageAsRead(session: Session, message: Message): Promise<ReadReceipt>
    {
        let url: string = `${session.serviceBaseURL}/messages/${message.messageId}/read`;

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: IIncomingReadReceipt) =>
            {
                return ReadReceiptAdapter.fromServerResponse(response);
            });
    }

    static markMessagesSinceAMessageAsRead(session: Session, sinceMessage: Message): Promise<Array<ReadReceipt>>
    {
        let url: string = `${session.serviceBaseURL}/messages/since/${sinceMessage.messageId}/read`;

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: Array<IIncomingReadReceipt>) =>
            {
                return map(response, (datum: IIncomingReadReceipt) =>
                {
                    return ReadReceiptAdapter.fromServerResponse(datum);
                });
            });
    }

    static markMessagesTillAMessageAsRead(session: Session, tillMessage: Message): Promise<Array<ReadReceipt>>
    {
        let url: string = `${session.serviceBaseURL}/messages/till/${tillMessage.messageId}/read`;

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            }
        })
            .then((response: any) =>
            {
                if(response.ok)
                {
                    return response.json();
                }
                else
                {
                    let error = new Error(response.statusText);
                    throw error;
                }
            })
            .then((response: Array<IIncomingReadReceipt>) =>
            {
                return map(response, (datum: IIncomingReadReceipt) =>
                {
                    return ReadReceiptAdapter.fromServerResponse(datum);
                });
            });
    }
}