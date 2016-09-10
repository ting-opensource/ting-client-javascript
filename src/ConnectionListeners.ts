import io from 'socket.io-client';

import {IIncomingTopic, Topic} from './models/Topic';
import {IIncomingMessage, Message} from './models/Message';
import {TopicAdapter} from './adapters/TopicAdapter';
import {MessageAdapter} from './adapters/MessageAdapter';
import {SubscriptionsStore} from './stores/SubscriptionsStore';

let subscriptionsStore:SubscriptionsStore = SubscriptionsStore.getInstance(); 

export function onConnect(socket:SocketIOClient.Socket)
{
    socket.on('error', onError);
    socket.on('disconnect', onDisconnect);

    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnecting', onReconnecting);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_error', onReconnectError);
    socket.on('reconnect_failed', onReconnectFailed);

    socket.on('message', onMessage);
}

export function onError()
{

}

export function onReconnectAttempt()
{

}

export function onReconnecting()
{

}

export function onReconnect()
{

}

export function onReconnectError()
{

}

export function onReconnectFailed()
{

}

export function onMessage(data:IIncomingMessage)
{
    let topicName:string = data.topic.name;

    let message:Message = MessageAdapter.fromServerResponse(data);

    subscriptionsStore.getTopicForName(topicName)
    .then((matchedTopic:Topic) =>
    {
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
    });
}

export function onDisconnect()
{

}