var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'whatwg-fetch', 'eventemitter2', 'socket.io-client', 'rxjs', './models/Session', './services/AuthenticationService', './services/MessagesService', './stores/SubscriptionsStore', './ConnectionListeners', './models/SocketConnectionEvents', './models/ConnectionStatuses', './models/TingEvents'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var EventEmitter = require('eventemitter2');
    var io = require('socket.io-client');
    var rxjs_1 = require('rxjs');
    var Session_1 = require('./models/Session');
    var AuthenticationService_1 = require('./services/AuthenticationService');
    var MessagesService_1 = require('./services/MessagesService');
    var SubscriptionsStore_1 = require('./stores/SubscriptionsStore');
    var ConnectionListeners_1 = require('./ConnectionListeners');
    var SocketConnectionEvents_1 = require('./models/SocketConnectionEvents');
    var ConnectionStatuses_1 = require('./models/ConnectionStatuses');
    var TingEvents_1 = require('./models/TingEvents');
    var _instance = null;
    var SingletonEnforcer = (function () {
        function SingletonEnforcer() {
        }
        return SingletonEnforcer;
    }());
    var TingClient = (function (_super) {
        __extends(TingClient, _super);
        function TingClient(serviceBaseURL, userId, clientId, clientSecret) {
            _super.call(this);
            this._connectionStatus = new rxjs_1.BehaviorSubject(ConnectionStatuses_1.ConnectionStatuses.DISCONNECTED);
            this._isConnected = new rxjs_1.BehaviorSubject(false);
            this._serviceBaseURL = '';
            this._userId = '';
            this._clientId = '';
            this._clientSecret = '';
            this._serviceBaseURL = serviceBaseURL;
            this._userId = userId;
            this._clientId = clientId;
            this._clientSecret = clientSecret;
            this._session = new Session_1.Session(serviceBaseURL, userId, clientId, clientSecret);
            this._subscriptionsStore = new SubscriptionsStore_1.SubscriptionsStore(this);
        }
        Object.defineProperty(TingClient, "ConnectionStatuses", {
            get: function () {
                return ConnectionStatuses_1.ConnectionStatuses;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient, "SocketConnectionEvents", {
            get: function () {
                return SocketConnectionEvents_1.SocketConnectionEvents;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient, "TingEvents", {
            get: function () {
                return TingEvents_1.TingEvents;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient.prototype, "transport", {
            get: function () {
                return this._transport;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient.prototype, "session", {
            get: function () {
                return this._session;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient.prototype, "connectionStatus", {
            get: function () {
                return this._connectionStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingClient.prototype, "isConnected", {
            get: function () {
                return this._isConnected;
            },
            enumerable: true,
            configurable: true
        });
        // Protected Method. Should not be called from public interface
        TingClient.prototype.__setConnectionStatus = function (latestConnectionStatus) {
            this._connectionStatus.next(latestConnectionStatus);
            if (latestConnectionStatus === ConnectionStatuses_1.ConnectionStatuses.CONNECTED) {
                this._isConnected.next(true);
            }
            else {
                this._isConnected.next(false);
            }
        };
        TingClient.prototype.connect = function () {
            var _this = this;
            this.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.CONNECTING);
            return AuthenticationService_1.AuthenticationService.authenticateSession(this._session)
                .then(function (session) {
                var liveConnectionPromise = new Promise(function (resolve, reject) {
                    _this._transport = io(_this._serviceBaseURL, {
                        path: '/live',
                        query: "token=" + session.token
                    });
                    var onSocketConnect = function () {
                        ConnectionListeners_1.onConnect(_this._transport, _this, _this._subscriptionsStore);
                        _this._transport.off(SocketConnectionEvents_1.SocketConnectionEvents.ERROR, onSocketConnectError);
                        _this.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.CONNECTED);
                        resolve(_this._transport);
                    };
                    var onSocketConnectError = function (error) {
                        _this._transport.off(SocketConnectionEvents_1.SocketConnectionEvents.CONNECT, onSocketConnect);
                        _this.__setConnectionStatus(ConnectionStatuses_1.ConnectionStatuses.ERRORED);
                        reject(error);
                    };
                    _this._transport.once(SocketConnectionEvents_1.SocketConnectionEvents.CONNECT, onSocketConnect);
                    _this._transport.once(SocketConnectionEvents_1.SocketConnectionEvents.ERROR, onSocketConnectError);
                });
                return liveConnectionPromise;
            });
        };
        TingClient.prototype.getSubscribedTopics = function () {
            return this._subscriptionsStore.subscribedTopics;
        };
        TingClient.prototype.getSubscribedTopicByName = function (topicName) {
            return this._subscriptionsStore.getTopicForName(topicName);
        };
        TingClient.prototype.subscribeToTopicByName = function (topicName) {
            return this._subscriptionsStore.subscribeToTopicByName(topicName);
        };
        TingClient.prototype.unsubscribeFromTopic = function (topic) {
            return this._subscriptionsStore.unsubscribeFromTopic(topic);
        };
        TingClient.prototype.getMessageStreamForTopicName = function (topicName) {
            return this._subscriptionsStore.getMessageStreamForTopicName(topicName);
        };
        TingClient.prototype.getMessageStreamForTopic = function (topic) {
            return this._subscriptionsStore.getMessageStreamForTopic(topic);
        };
        TingClient.prototype.fetchMessagesForTopicSinceMessage = function (topic, sinceMessage) {
            return this._subscriptionsStore.fetchMessagesForTopicSinceMessage(topic, sinceMessage);
        };
        TingClient.prototype.fetchMessagesForTopicTillMessage = function (topic, tillMessage) {
            return this._subscriptionsStore.fetchMessagesForTopicTillMessage(topic, tillMessage);
        };
        TingClient.prototype.publishMessage = function (topicName, messageBody, messageType) {
            return MessagesService_1.MessagesService.publishMessage(this.session, topicName, messageBody, messageType);
        };
        return TingClient;
    }(EventEmitter.EventEmitter2));
    exports.TingClient = TingClient;
});
//# sourceMappingURL=TingClient.js.map