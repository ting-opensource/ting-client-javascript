System.register(['./adapters/TopicAdapter', './adapters/SubscriptionAdapter', './adapters/MessageAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TopicAdapter_1, SubscriptionAdapter_1, MessageAdapter_1;
    function onConnect(socket, subscriptionsStore, messagesStore) {
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
        function onSubscriptionSuccess(subscriptionData) {
            var subscription = SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(subscriptionData);
            var matchedTopic = subscriptionsStore.getTopicForName(subscription.topic.name);
            if (!matchedTopic) {
                subscriptionsStore.addSubscribedTopic(subscription.topic);
            }
        }
        function onUnsubscriptionSuccess(subscriptionData) {
            var subscription = SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(subscriptionData);
            subscriptionsStore.removeSubscribedTopicById(subscription.topic.topicId);
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
            messagesStore.addMessage(message);
        }
        function onDisconnect() {
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
    exports_1("onConnect", onConnect);
    return {
        setters:[
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            },
            function (SubscriptionAdapter_1_1) {
                SubscriptionAdapter_1 = SubscriptionAdapter_1_1;
            },
            function (MessageAdapter_1_1) {
                MessageAdapter_1 = MessageAdapter_1_1;
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=ConnectionListeners.js.map