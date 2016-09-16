System.register(['whatwg-fetch', 'eventemitter3', 'socket.io-client', './models/Session', './services/AuthenticationService', './stores/SubscriptionsStore', './ConnectionListeners'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var eventemitter3_1, socket_io_client_1, Session_1, AuthenticationService_1, SubscriptionsStore_1, ConnectionListeners_1;
    var _instance, SingletonEnforcer, TingClient;
    return {
        setters:[
            function (_1) {},
            function (eventemitter3_1_1) {
                eventemitter3_1 = eventemitter3_1_1;
            },
            function (socket_io_client_1_1) {
                socket_io_client_1 = socket_io_client_1_1;
            },
            function (Session_1_1) {
                Session_1 = Session_1_1;
            },
            function (AuthenticationService_1_1) {
                AuthenticationService_1 = AuthenticationService_1_1;
            },
            function (SubscriptionsStore_1_1) {
                SubscriptionsStore_1 = SubscriptionsStore_1_1;
            },
            function (ConnectionListeners_1_1) {
                ConnectionListeners_1 = ConnectionListeners_1_1;
            }],
        execute: function() {
            _instance = null;
            SingletonEnforcer = (function () {
                function SingletonEnforcer() {
                }
                return SingletonEnforcer;
            }());
            TingClient = (function (_super) {
                __extends(TingClient, _super);
                function TingClient(serviceBaseURL, userId) {
                    _super.call(this);
                    this._serviceBaseURL = '';
                    this._userId = '';
                    this._serviceBaseURL = serviceBaseURL;
                    this._userId = userId;
                    this._session = new Session_1.Session(serviceBaseURL, userId);
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
                            _this._transport = socket_io_client_1.default(_this._serviceBaseURL, {
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
            }(eventemitter3_1.default));
            exports_1("TingClient", TingClient);
        }
    }
});
//# sourceMappingURL=TingClient.js.map