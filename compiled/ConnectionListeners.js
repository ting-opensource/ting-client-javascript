System.register(['./models/SocketConnectionEvents', './models/TingEvents', './adapters/TopicAdapter', './adapters/MessageAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SocketConnectionEvents_1, TingEvents_1, TopicAdapter_1, MessageAdapter_1;
    function onConnect(socket, clientFacade, subscriptionsStore) {
        function onError() {
        }
        function onReconnectAttempt() {
        }
        function onReconnecting() {
        }
        function onReconnect() {
        }
        function onReconnectError() {
        }
        function onReconnectFailed() {
        }
        function onSubscriptionLive(topicData) {
            var topic = TopicAdapter_1.TopicAdapter.fromServerResponse(topicData);
            var matchedTopic = subscriptionsStore.getTopicForName(topic.name);
            if (!matchedTopic) {
                subscriptionsStore.addSubscribedTopic(topic);
            }
            clientFacade.emit('subscription-live', topic);
        }
        function onSubscriptionOff(topicData) {
            var topic = TopicAdapter_1.TopicAdapter.fromServerResponse(topicData);
            subscriptionsStore.removeSubscribedTopicById(topic.topicId);
            clientFacade.emit('subscription-off', topic);
        }
        function onMessage(data) {
            var topicName = data.topic.name;
            var message = MessageAdapter_1.MessageAdapter.fromServerResponse(data);
            var matchedTopic = subscriptionsStore.getTopicForName(topicName);
            if (matchedTopic) {
                message.topic = matchedTopic;
                matchedTopic.addMessage(message);
            }
            else {
                var topic = TopicAdapter_1.TopicAdapter.fromServerResponse(data.topic);
                message.topic = topic;
                topic.addMessage(message);
                subscriptionsStore.addSubscribedTopic(topic);
            }
            clientFacade.emit('message', message);
            clientFacade.emit("message:" + message.topic.name, message);
        }
        function onDisconnect() {
        }
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.ERROR, onError);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.DISCONNECT, onDisconnect);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.RECONNECT_ATTEMPT, onReconnectAttempt);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.RECONNECTING, onReconnecting);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.RECONNECT, onReconnect);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.RECONNECT_ERROR, onReconnectError);
        socket.on(SocketConnectionEvents_1.SocketConnectionEvents.RECONNECT_FAILED, onReconnectFailed);
        socket.on(TingEvents_1.TingEvents.SUBSCRIPTION_LIVE, onSubscriptionLive);
        socket.on(TingEvents_1.TingEvents.SUBSCRIPTION_OFF, onSubscriptionOff);
        socket.on(TingEvents_1.TingEvents.MESSAGE, onMessage);
    }
    exports_1("onConnect", onConnect);
    return {
        setters:[
            function (SocketConnectionEvents_1_1) {
                SocketConnectionEvents_1 = SocketConnectionEvents_1_1;
            },
            function (TingEvents_1_1) {
                TingEvents_1 = TingEvents_1_1;
            },
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            },
            function (MessageAdapter_1_1) {
                MessageAdapter_1 = MessageAdapter_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=ConnectionListeners.js.map