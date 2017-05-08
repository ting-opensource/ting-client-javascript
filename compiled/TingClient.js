var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "whatwg-fetch", "eventemitter2", "socket.io-client", "rxjs", "./models/Session", "./services/AuthenticationService", "./services/MessagesService", "./stores/SubscriptionsStore", "./ConnectionListeners", "./models/SocketConnectionEvents", "./models/ConnectionStatuses", "./models/TingEvents"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("whatwg-fetch");
    var EventEmitter = require("eventemitter2");
    var io = require("socket.io-client");
    var rxjs_1 = require("rxjs");
    var Session_1 = require("./models/Session");
    var AuthenticationService_1 = require("./services/AuthenticationService");
    var MessagesService_1 = require("./services/MessagesService");
    var SubscriptionsStore_1 = require("./stores/SubscriptionsStore");
    var ConnectionListeners_1 = require("./ConnectionListeners");
    var SocketConnectionEvents_1 = require("./models/SocketConnectionEvents");
    var ConnectionStatuses_1 = require("./models/ConnectionStatuses");
    var TingEvents_1 = require("./models/TingEvents");
    var _instance = null;
    var SingletonEnforcer = (function () {
        function SingletonEnforcer() {
        }
        return SingletonEnforcer;
    }());
    var TingClient = (function (_super) {
        __extends(TingClient, _super);
        function TingClient(serviceBaseURL, userId, clientId, clientSecret) {
            var _this = _super.call(this) || this;
            _this._connectionStatus = new rxjs_1.BehaviorSubject(ConnectionStatuses_1.ConnectionStatuses.DISCONNECTED);
            _this._isConnected = new rxjs_1.BehaviorSubject(false);
            _this._serviceBaseURL = '';
            _this._userId = '';
            _this._clientId = '';
            _this._clientSecret = '';
            _this._manualConnectionPromise = null;
            _this._serviceBaseURL = serviceBaseURL;
            _this._userId = userId;
            _this._clientId = clientId;
            _this._clientSecret = clientSecret;
            _this._session = new Session_1.Session(serviceBaseURL, userId, clientId, clientSecret);
            _this._subscriptionsStore = new SubscriptionsStore_1.SubscriptionsStore(_this);
            return _this;
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
            if (this.connectionStatus.getValue() !== ConnectionStatuses_1.ConnectionStatuses.DISCONNECTED) {
                if (this._manualConnectionPromise) {
                    return this._manualConnectionPromise;
                }
                else {
                    return Promise.resolve(this._transport);
                }
            }
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
                _this._manualConnectionPromise = liveConnectionPromise;
                return liveConnectionPromise;
            });
        };
        TingClient.prototype.disconnect = function () {
            this.transport.disconnect();
            this._manualConnectionPromise = null;
            this._subscriptionsStore.reset();
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
        TingClient.prototype.publishFile = function (topicName, file) {
            return MessagesService_1.MessagesService.publishFile(this.session, topicName, file);
        };
        TingClient.prototype.getFileDownloadURL = function (fileMeatdata) {
            return this.session.serviceBaseURL + "/files/" + fileMeatdata.key;
        };
        TingClient.prototype.markAMessageAsRead = function (message) {
            return this._subscriptionsStore.markAMessageAsRead(message);
        };
        TingClient.prototype.markMessagesTillAMessageAsRead = function (tillMessage) {
            return this._subscriptionsStore.markMessagesTillAMessageAsRead(tillMessage);
        };
        TingClient.prototype.markMessagesSinceAMessageAsRead = function (sinceMessage) {
            return this._subscriptionsStore.markMessagesSinceAMessageAsRead(sinceMessage);
        };
        return TingClient;
    }(EventEmitter.EventEmitter2));
    exports.TingClient = TingClient;
});
//# sourceMappingURL=TingClient.js.map