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
        define(["require", "exports", 'whatwg-fetch', 'eventemitter3', 'socket.io-client', './models/Session', './services/AuthenticationService', './stores/SubscriptionsStore', './ConnectionListeners'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var EventEmitter = require('eventemitter3');
    var io = require('socket.io-client');
    var Session_1 = require('./models/Session');
    var AuthenticationService_1 = require('./services/AuthenticationService');
    var SubscriptionsStore_1 = require('./stores/SubscriptionsStore');
    var ConnectionListeners_1 = require('./ConnectionListeners');
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
        Object.defineProperty(TingClient.prototype, "session", {
            get: function () {
                return this._session;
            },
            enumerable: true,
            configurable: true
        });
        TingClient.prototype.connect = function () {
            var _this = this;
            return AuthenticationService_1.AuthenticationService.authenticateSession(this._session)
                .then(function (session) {
                var liveConnectionPromise = new Promise(function (resolve, reject) {
                    _this._transport = io(_this._serviceBaseURL, {
                        path: '/live',
                        query: "token=" + session.token
                    });
                    _this._transport.on('connect', function () {
                        ConnectionListeners_1.onConnect(_this._transport, _this, _this._subscriptionsStore);
                        resolve(_this._transport);
                    });
                    _this._transport.once('error', function (error) {
                        reject(error);
                    });
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
        return TingClient;
    }(EventEmitter));
    exports.TingClient = TingClient;
});
//# sourceMappingURL=TingClient.js.map