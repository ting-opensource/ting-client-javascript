import io from 'socket.io-client';

import {IIncomingTopic, Topic} from './models/Topic';
import {IIncomingSubscription, Subscription} from './models/Subscription';
import {IIncomingMessage, Message} from './models/Message';
import {TopicAdapter} from './adapters/TopicAdapter';
import {SubscriptionAdapter} from './adapters/SubscriptionAdapter';
import {MessageAdapter} from './adapters/MessageAdapter';
import {SubscriptionsStore} from './stores/SubscriptionsStore';
import {MessagesStore} from './stores/MessagesStore';

export function onConnect(socket:SocketIOClient.Socket, subscriptionsStore:SubscriptionsStore, messagesStore:MessagesStore)
{
    function onError()
    {

    }

    function onReconnectAttempt()
    {

    }

    function onReconnecting()
    {

    }

    function onReconnect()
    {

    }

    function onReconnectError()
    {

    }

    function onReconnectFailed()
    {

    }

    function onSubscriptionSuccess(subscriptionData:IIncomingSubscription)
    {
        let subscription:Subscription = SubscriptionAdapter.fromServerResponse(subscriptionData);

        let matchedTopic:Topic = subscriptionsStore.getTopicForName(subscription.topic.name)

        if(!matchedTopic)
        {
            subscriptionsStore.addSubscribedTopic(subscription.topic);
        }
    }

    function onUnsubscriptionSuccess(subscriptionData:IIncomingSubscription)
    {
        let subscription:Subscription = SubscriptionAdapter.fromServerResponse(subscriptionData);

        subscriptionsStore.removeSubscribedTopicById(subscription.topic.topicId);
    }

    function onMessage(data:IIncomingMessage)
    {
        let topicName:string = data.topic.name;

        let message:Message = MessageAdapter.fromServerResponse(data);

        let matchedTopic:Topic = subscriptionsStore.getTopicForName(topicName)

        if(matchedTopic)
        {
            message.topic = matchedTopic;
            matchedTopic.addMessage(message);
        }
        else
        {
            let topic:Topic = TopicAdapter.fromServerResponse(data.topic);
            message.topic = topic;
            topic.addMessage(message);
            subscriptionsStore.addSubscribedTopic(topic);
        }

        messagesStore.addMessage(message);
    }

    function onDisconnect()
    {

    }

    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);

    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnecting', onReconnecting);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_error', onReconnectError);
    socket.on('reconnect_failed', onReconnectFailed);

    socket.on('subscription-success', onSubscriptionSuccess);
    socket.on('unsubscription-success', onSubscriptionSuccess);
    socket.on('message', onMessage);
}