System.register(['./adapters/TopicAdapter', './adapters/MessageAdapter', './stores/SubscriptionsStore'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TopicAdapter_1, MessageAdapter_1, SubscriptionsStore_1;
    var subscriptionsStore;
    function onConnect(socket) {
        socket.on('error', onError);
        socket.on('disconnect', onDisconnect);
        socket.on('reconnect_attempt', onReconnectAttempt);
        socket.on('reconnecting', onReconnecting);
        socket.on('reconnect', onReconnect);
        socket.on('reconnect_error', onReconnectError);
        socket.on('reconnect_failed', onReconnectFailed);
        socket.on('message', onMessage);
    }
    exports_1("onConnect", onConnect);
    function onError() {
    }
    exports_1("onError", onError);
    function onReconnectAttempt() {
    }
    exports_1("onReconnectAttempt", onReconnectAttempt);
    function onReconnecting() {
    }
    exports_1("onReconnecting", onReconnecting);
    function onReconnect() {
    }
    exports_1("onReconnect", onReconnect);
    function onReconnectError() {
    }
    exports_1("onReconnectError", onReconnectError);
    function onReconnectFailed() {
    }
    exports_1("onReconnectFailed", onReconnectFailed);
    function onMessage(data) {
        var topicName = data.topic.name;
        var message = MessageAdapter_1.MessageAdapter.fromServerResponse(data);
        subscriptionsStore.getTopicForName(topicName)
            .then(function (matchedTopic) {
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
        });
    }
    exports_1("onMessage", onMessage);
    function onDisconnect() {
    }
    exports_1("onDisconnect", onDisconnect);
    return {
        setters:[
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            },
            function (MessageAdapter_1_1) {
                MessageAdapter_1 = MessageAdapter_1_1;
            },
            function (SubscriptionsStore_1_1) {
                SubscriptionsStore_1 = SubscriptionsStore_1_1;
            }],
        execute: function() {
            subscriptionsStore = SubscriptionsStore_1.SubscriptionsStore.getInstance();
        }
    }
});
//# sourceMappingURL=ConnectionListeners.js.map