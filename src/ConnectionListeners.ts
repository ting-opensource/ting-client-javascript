import * as io from 'socket.io-client';

import { TingClient } from './TingClient';
import { IIncomingTopic, Topic } from './models/Topic';
import { IIncomingSubscription, Subscription } from './models/Subscription';
import { IIncomingMessage, Message } from './models/Message';
import { IIncomingReadReceipt, ReadReceipt } from './models/ReadReceipt';
import { SocketConnectionEvents } from './models/SocketConnectionEvents';
import { ConnectionStatuses } from './models/ConnectionStatuses';
import { TingEvents } from './models/TingEvents';
import { TopicAdapter } from './adapters/TopicAdapter';
import { SubscriptionAdapter } from './adapters/SubscriptionAdapter';
import { MessageAdapter } from './adapters/MessageAdapter';
import { ReadReceiptAdapter } from './adapters/ReadReceiptAdapter';
import { SubscriptionsStore } from './stores/SubscriptionsStore';

export function onConnect(socket: SocketIOClient.Socket, clientFacade: TingClient, subscriptionsStore: SubscriptionsStore)
{
    function onError()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.ERRORED);
    }

    function onReconnectAttempt()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.CONNECTING);
    }

    function onReconnecting()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.CONNECTING);
    }

    function onReconnect()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.CONNECTED);
    }

    function onReconnectError()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.ERRORED);
    }

    function onReconnectFailed()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.ERRORED);
    }

    function onSubscriptionLive(topicData: IIncomingTopic)
    {
        let topic: Topic = TopicAdapter.fromServerResponse(topicData);

        let matchedTopic: Topic = subscriptionsStore.getTopicForName(topic.name);

        if(!matchedTopic)
        {
            subscriptionsStore.addSubscribedTopic(topic);
        }

        clientFacade.emit('subscription-live', topic);
    }

    function onSubscriptionOff(topicData: IIncomingTopic)
    {
        let topic: Topic = TopicAdapter.fromServerResponse(topicData);

        subscriptionsStore.removeSubscribedTopicById(topic.topicId);

        clientFacade.emit('subscription-off', topic);
    }

    function onMessage(data: IIncomingMessage)
    {
        let topicName: string = data.topic.name;

        let message: Message = MessageAdapter.fromServerResponse(data);

        let matchedTopic: Topic = subscriptionsStore.getTopicForName(topicName);

        if(matchedTopic)
        {
            message.topic = matchedTopic;
            matchedTopic.addMessage(message);
        }
        else
        {
            let topic: Topic = TopicAdapter.fromServerResponse(data.topic);
            message.topic = topic;
            topic.addMessage(message);
            subscriptionsStore.addSubscribedTopic(topic);
        }

        clientFacade.emit('message', message);
        clientFacade.emit(`message:${message.topic.name}`, message);
    }

    function onMessageRead(data: {
        topic: IIncomingTopic,
        readReceipt: IIncomingReadReceipt
    })
    {
        let topicName: string = data.topic.name;

        let matchedTopic: Topic = subscriptionsStore.getTopicForName(topicName);

        if(matchedTopic)
        {
            let readReceipt: ReadReceipt = ReadReceiptAdapter.fromServerResponse(data.readReceipt);
            matchedTopic.markAMessageAsRead(readReceipt);

            clientFacade.emit('message-read', matchedTopic, readReceipt);
            clientFacade.emit(`message-read:${matchedTopic.name}`, readReceipt);
        }
    }

    function onDisconnect()
    {
        clientFacade.__setConnectionStatus(ConnectionStatuses.DISCONNECTED);
    }

    socket.on(SocketConnectionEvents.ERROR, onError);
    socket.on(SocketConnectionEvents.DISCONNECT, onDisconnect);

    socket.on(SocketConnectionEvents.RECONNECT_ATTEMPT, onReconnectAttempt);
    socket.on(SocketConnectionEvents.RECONNECTING, onReconnecting);
    socket.on(SocketConnectionEvents.RECONNECT, onReconnect);
    socket.on(SocketConnectionEvents.RECONNECT_ERROR, onReconnectError);
    socket.on(SocketConnectionEvents.RECONNECT_FAILED, onReconnectFailed);

    socket.on(TingEvents.SUBSCRIPTION_LIVE, onSubscriptionLive);
    socket.on(TingEvents.SUBSCRIPTION_OFF, onSubscriptionOff);
    socket.on(TingEvents.MESSAGE, onMessage);
    socket.on(TingEvents.MESSAGE_READ, onMessageRead);
}