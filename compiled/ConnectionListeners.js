(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", './models/SocketConnectionEvents', './models/ConnectionStatuses', './models/TingEvents', './adapters/TopicAdapter', './adapters/MessageAdapter'], factory);
    }
})(function (require, exports) {
    "use strict";
    var SocketConnectionEvents_1 = require('./models/SocketConnectionEvents');
    var ConnectionStatuses_1 = require('./models/ConnectionStatuses');
    var TingEvents_1 = require('./models/TingEvents');
    var TopicAdapter_1 = require('./adapters/TopicAdapter');
    var MessageAdapter_1 = require('./adapters/MessageAdapter');
    function onConnect(socket, clientFacade, subscriptionsStore) {
        function onError() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.ERRORED);
        }
        function onReconnectAttempt() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.CONNECTING);
        }
        function onReconnecting() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.CONNECTING);
        }
        function onReconnect() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.CONNECTED);
        }
        function onReconnectError() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.ERRORED);
        }
        function onReconnectFailed() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.ERRORED);
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
            clientFacade.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.DISCONNECTED);
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
    exports.onConnect = onConnect;
});
//# sourceMappingURL=ConnectionListeners.js.map