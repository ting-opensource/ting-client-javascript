System.register(['whatwg-fetch', 'eventemitter3', 'socket.io-client', './stores/SubscriptionsStore', './stores/MessagesStore', './ConnectionListeners'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var eventemitter3_1, socket_io_client_1, SubscriptionsStore_1, MessagesStore_1, ConnectionListeners_1;
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
            function (SubscriptionsStore_1_1) {
                SubscriptionsStore_1 = SubscriptionsStore_1_1;
            },
            function (MessagesStore_1_1) {
                MessagesStore_1 = MessagesStore_1_1;
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
                    this._subscriptionsStore = new SubscriptionsStore_1.SubscriptionsStore();
                    this._messagesStore = new MessagesStore_1.MessagesStore();
                }
                TingClient.prototype._authorize = function (userId) {
                    return fetch(this._serviceBaseURL + '/authorize', {
                        method: 'POST',
                        body: JSON.stringify({
                            userId: this._userId
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        }
                        else {
                            var error = new Error(response.statusText);
                            throw error;
                        }
                    })
                        .then(function (response) {
                        return response.token;
                    });
                };
                TingClient.prototype.connect = function () {
                    var _this = this;
                    return this._authorize(this._userId)
                        .then(function (token) {
                        var liveConnectionPromise = new Promise(function (resolve, reject) {
                            _this._transport = socket_io_client_1.default(_this._serviceBaseURL, {
                                path: '/live',
                                query: "token=" + token
                            });
                            _this._transport.on('connect', function () {
                                ConnectionListeners_1.onConnect(_this._transport, _this._subscriptionsStore, _this._messagesStore);
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
                TingClient.prototype.getMessageStreamForTopicName = function (topicName) {
                    return this._messagesStore.getMessageStreamForTopicName(topicName);
                };
                return TingClient;
            }(eventemitter3_1.default));
            exports_1("TingClient", TingClient);
        }
    }
});
//# sourceMappingURL=TingClient.js.map