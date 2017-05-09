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
define("models/Session", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Session = (function () {
        function Session(serviceBaseURL, userId, clientId, clientSecret) {
            this._serviceBaseURL = '';
            this._userId = '';
            this._clientId = '';
            this._clientSecret = '';
            this._token = '';
            this._serviceBaseURL = serviceBaseURL;
            this._userId = userId;
            this._clientId = clientId;
            this._clientSecret = clientSecret;
        }
        Object.defineProperty(Session.prototype, "serviceBaseURL", {
            get: function () {
                return this._serviceBaseURL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "userId", {
            get: function () {
                return this._userId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "clientId", {
            get: function () {
                return this._clientId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "clientSecret", {
            get: function () {
                return this._clientSecret;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "token", {
            get: function () {
                return this._token;
            },
            enumerable: true,
            configurable: true
        });
        Session.prototype.isAuthenticated = function () {
            return this._token ? true : false;
        };
        Session.prototype.autheticateWithToken = function (token) {
            this._token = token;
        };
        return Session;
    }());
    exports.Session = Session;
});
define("models/MessageTypes", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageTypes = (function () {
        function MessageTypes() {
        }
        Object.defineProperty(MessageTypes, "TEXT", {
            get: function () {
                return 'text/plain';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageTypes, "HTML", {
            get: function () {
                return 'text/html';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageTypes, "JSON", {
            get: function () {
                return 'application/json';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MessageTypes, "FILE", {
            get: function () {
                return 'application/octet-stream';
            },
            enumerable: true,
            configurable: true
        });
        return MessageTypes;
    }());
    exports.MessageTypes = MessageTypes;
});
define("models/Message", ["require", "exports", "models/MessageTypes"], function (require, exports, MessageTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Message = (function () {
        function Message(data) {
            this.messageId = '';
            this.topic = null;
            this.publisher = '';
            this.type = MessageTypes_1.MessageTypes.TEXT;
            this.body = '';
            this.createdAt = null;
            this.updatedBy = '';
            this.updatedAt = null;
            this.subscriber = '';
            this.readOn = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        Object.defineProperty(Message.prototype, "isRead", {
            get: function () {
                return this.readOn === null ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        return Message;
    }());
    exports.Message = Message;
});
define("models/ReadReceipt", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReadReceipt = (function () {
        function ReadReceipt(data) {
            this.messageId = '';
            this.subscriber = '';
            this.readOn = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        return ReadReceipt;
    }());
    exports.ReadReceipt = ReadReceipt;
});
define("models/Topic", ["require", "exports", "lodash", "rxjs"], function (require, exports, _, rxjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BUFFER_SIZE = 999;
    var Topic = (function () {
        function Topic(data) {
            var _this = this;
            this.topicId = '';
            this.name = '';
            this.isActive = false;
            this.createdBy = '';
            this.createdAt = null;
            this.updatedBy = '';
            this.updatedAt = null;
            this._unreadCountSubscription = null;
            this._messages = new rxjs_1.BehaviorSubject([]);
            this._unreadMessagesCount = new rxjs_1.BehaviorSubject(-1);
            for (var key in data) {
                this[key] = data[key];
            }
            this._unreadCountSubscription = this._messages.subscribe(function (messages) {
                var unreadMessages = _.chain(messages).filter(function (datum) {
                    return !datum.isRead;
                }).value();
                _this.unreadMessagesCount.next(unreadMessages.length);
            });
        }
        Object.defineProperty(Topic.prototype, "messages", {
            get: function () {
                return this._messages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Topic.prototype, "unreadMessagesCount", {
            get: function () {
                return this._unreadMessagesCount;
            },
            enumerable: true,
            configurable: true
        });
        Topic.prototype.addMessage = function (message) {
            return this.mergeMessages([message]);
        };
        Topic.prototype.mergeMessages = function (incomingMessages) {
            var existingMesssages = this.messages.getValue();
            var mergedMessages = _.unionBy(incomingMessages, existingMesssages, 'messageId');
            mergedMessages = _.sortBy(mergedMessages, function (datum) {
                return -(datum.updatedAt.valueOf());
            });
            this.messages.next(mergedMessages);
            return this.messages;
        };
        Topic.prototype.markAMessageAsRead = function (readReceipt) {
            return this.markMessagesAsRead([readReceipt]);
        };
        Topic.prototype.markMessagesAsRead = function (readReceipts) {
            var existingMesssages = this.messages.getValue();
            var readReceiptsKeyedByMessageId = _.keyBy(readReceipts, function (datum) {
                return datum.messageId;
            });
            var messageIdsInReadReceipts = _.keys(readReceiptsKeyedByMessageId);
            _.forEach(existingMesssages, function (datum) {
                if (_.indexOf(messageIdsInReadReceipts, datum.messageId) > -1) {
                    _.extend(datum, readReceiptsKeyedByMessageId[datum.messageId]);
                }
            });
            this.messages.next(existingMesssages);
            return this.messages;
        };
        Topic.prototype.reset = function () {
            this._unreadCountSubscription.unsubscribe();
            this.messages.next([]);
            this.unreadMessagesCount.next(0);
        };
        return Topic;
    }());
    exports.Topic = Topic;
});
define("models/Subscription", ["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Subscription = (function () {
        function Subscription(data) {
            this.subscriptionId = '';
            this.topic = null;
            this.subscriber = '';
            this.isDurable = false;
            this.isActive = false;
            this.createdAt = null;
            this.updatedAt = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        return Subscription;
    }());
    exports.Subscription = Subscription;
});
define("models/FileMetadata", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileMetadata = (function () {
        function FileMetadata(data) {
            this.key = '';
            this.originalName = '';
            this.contentType = '';
            this.createdAt = null;
            this.updatedAt = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        return FileMetadata;
    }());
    exports.FileMetadata = FileMetadata;
});
define("utils/Base64Encoder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Base64Encoder = (function () {
        function Base64Encoder() {
        }
        Base64Encoder.encode = function (data) {
            return window.btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, pattern) {
                return String.fromCharCode(parseInt('0x' + pattern));
            }));
        };
        return Base64Encoder;
    }());
    exports.Base64Encoder = Base64Encoder;
});
define("services/AuthenticationService", ["require", "exports", "utils/Base64Encoder", "whatwg-fetch"], function (require, exports, Base64Encoder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AuthenticationService = (function () {
        function AuthenticationService() {
        }
        AuthenticationService.authenticateSession = function (session) {
            var clientAuthCredentials = session.clientId + ":" + session.clientSecret;
            return fetch(session.serviceBaseURL + "/authorize", {
                method: 'POST',
                body: JSON.stringify({
                    userId: session.userId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Basic " + Base64Encoder_1.Base64Encoder.encode(clientAuthCredentials)
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
                session.autheticateWithToken(response.token);
                return session;
            });
        };
        return AuthenticationService;
    }());
    exports.AuthenticationService = AuthenticationService;
});
define("adapters/TopicAdapter", ["require", "exports", "moment", "lodash", "models/Topic"], function (require, exports, moment, _, Topic_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TopicAdapter = (function () {
        function TopicAdapter() {
        }
        TopicAdapter.fromServerResponse = function (topicData) {
            var topic = new Topic_1.Topic(_.extend({}, topicData, {
                createdAt: topicData.createdAt ? moment.utc(topicData.createdAt) : null,
                updatedAt: topicData.updatedAt ? moment.utc(topicData.updatedAt) : null
            }));
            return topic;
        };
        return TopicAdapter;
    }());
    exports.TopicAdapter = TopicAdapter;
});
define("adapters/MessageAdapter", ["require", "exports", "moment", "lodash", "models/Message", "models/FileMetadata", "models/MessageTypes", "adapters/TopicAdapter"], function (require, exports, moment, _, Message_1, FileMetadata_1, MessageTypes_2, TopicAdapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageAdapter = (function () {
        function MessageAdapter() {
        }
        MessageAdapter.fileMetadataFromServerResponse = function (fileMetadataData) {
            return new FileMetadata_1.FileMetadata(_.extend({}, fileMetadataData, {
                createdAt: fileMetadataData.createdAt ? moment.utc(fileMetadataData.createdAt) : null,
                updatedAt: fileMetadataData.updatedAt ? moment.utc(fileMetadataData.updatedAt) : null,
            }));
        };
        MessageAdapter.fromServerResponse = function (messageData) {
            var messageBody = '';
            var type = messageData.type;
            try {
                if (messageData.type === MessageTypes_2.MessageTypes.JSON) {
                    messageBody = JSON.parse(messageData.body);
                }
                else if (messageData.type === MessageTypes_2.MessageTypes.FILE) {
                    var fileMetadataData = JSON.parse(messageData.body);
                    messageBody = MessageAdapter.fileMetadataFromServerResponse(fileMetadataData);
                }
                else {
                    messageBody = messageData.body;
                }
            }
            catch (error) {
                messageBody = messageData.body;
                type = MessageTypes_2.MessageTypes.TEXT;
            }
            var message = new Message_1.Message(_.extend({}, messageData, {
                type: type,
                body: messageBody,
                topic: TopicAdapter_1.TopicAdapter.fromServerResponse(messageData.topic),
                createdAt: messageData.createdAt ? moment.utc(messageData.createdAt) : null,
                updatedAt: messageData.updatedAt ? moment.utc(messageData.updatedAt) : null,
                readOn: messageData.readOn ? moment.utc(messageData.updatedAt) : null,
            }));
            return message;
        };
        return MessageAdapter;
    }());
    exports.MessageAdapter = MessageAdapter;
});
define("adapters/ReadReceiptAdapter", ["require", "exports", "moment", "lodash", "models/ReadReceipt"], function (require, exports, moment, _, ReadReceipt_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReadReceiptAdapter = (function () {
        function ReadReceiptAdapter() {
        }
        ReadReceiptAdapter.fromServerResponse = function (readReceiptData) {
            var readReceipt = new ReadReceipt_1.ReadReceipt(_.extend({}, readReceiptData, {
                readOn: readReceiptData.readOn ? moment.utc(readReceiptData.readOn) : null,
            }));
            return readReceipt;
        };
        return ReadReceiptAdapter;
    }());
    exports.ReadReceiptAdapter = ReadReceiptAdapter;
});
define("services/MessagesService", ["require", "exports", "lodash", "models/MessageTypes", "adapters/MessageAdapter", "adapters/ReadReceiptAdapter", "whatwg-fetch"], function (require, exports, _, MessageTypes_3, MessageAdapter_1, ReadReceiptAdapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_PAGE_SIZE = 100;
    var MessagesService = (function () {
        function MessagesService() {
        }
        MessagesService.fetchMessagesForTopicSinceMessage = function (session, topic, message) {
            var url = session.serviceBaseURL + "/messages?topic=" + encodeURIComponent(topic.name) + "&sinceMessageId=" + encodeURIComponent(message.messageId) + "&pageSize=" + encodeURIComponent(DEFAULT_PAGE_SIZE.toString());
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return _.map(response, function (datum) {
                    return MessageAdapter_1.MessageAdapter.fromServerResponse(datum);
                });
            });
        };
        MessagesService.fetchMessagesForTopicTillMessage = function (session, topic, message) {
            var url = session.serviceBaseURL + "/messages?topic=" + encodeURIComponent(topic.name) + "&tillMessageId=" + encodeURIComponent(message.messageId) + "&pageSize=" + encodeURIComponent(DEFAULT_PAGE_SIZE.toString());
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return _.map(response, function (datum) {
                    return MessageAdapter_1.MessageAdapter.fromServerResponse(datum);
                });
            });
        };
        MessagesService.publishMessage = function (session, topicName, messageBody, messageType) {
            if (messageType === void 0) { messageType = MessageTypes_3.MessageTypes.TEXT; }
            var url = session.serviceBaseURL + "/messages/publish";
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
                },
                body: JSON.stringify({
                    topic: {
                        name: topicName,
                        createIfNotExist: true
                    },
                    message: {
                        type: messageType,
                        body: messageBody
                    }
                })
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
                return MessageAdapter_1.MessageAdapter.fromServerResponse(response);
            });
        };
        MessagesService.publishFile = function (session, topicName, file) {
            var url = session.serviceBaseURL + "/files";
            var formData = new FormData();
            formData.append('topicName', topicName);
            formData.append('createTopicIfNotExist', 'true');
            formData.append('file', file);
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + session.token
                },
                body: formData
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
                return MessageAdapter_1.MessageAdapter.fromServerResponse(response);
            });
        };
        MessagesService.markAMessageAsRead = function (session, message) {
            var url = session.serviceBaseURL + "/messages/" + message.messageId + "/read";
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return ReadReceiptAdapter_1.ReadReceiptAdapter.fromServerResponse(response);
            });
        };
        MessagesService.markMessagesSinceAMessageAsRead = function (session, sinceMessage) {
            var url = session.serviceBaseURL + "/messages/since/" + sinceMessage.messageId + "/read";
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return _.map(response, function (datum) {
                    return ReadReceiptAdapter_1.ReadReceiptAdapter.fromServerResponse(datum);
                });
            });
        };
        MessagesService.markMessagesTillAMessageAsRead = function (session, tillMessage) {
            var url = session.serviceBaseURL + "/messages/till/" + tillMessage.messageId + "/read";
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return _.map(response, function (datum) {
                    return ReadReceiptAdapter_1.ReadReceiptAdapter.fromServerResponse(datum);
                });
            });
        };
        return MessagesService;
    }());
    exports.MessagesService = MessagesService;
});
define("adapters/SubscriptionAdapter", ["require", "exports", "moment", "lodash", "models/Subscription", "adapters/TopicAdapter"], function (require, exports, moment, _, Subscription_1, TopicAdapter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionAdapter = (function () {
        function SubscriptionAdapter() {
        }
        SubscriptionAdapter.fromServerResponse = function (subscriptionData) {
            var subscription = new Subscription_1.Subscription(_.extend({}, subscriptionData, {
                topic: TopicAdapter_2.TopicAdapter.fromServerResponse(subscriptionData.topic),
                createdAt: subscriptionData.createdAt ? moment.utc(subscriptionData.createdAt) : null,
                updatedAt: subscriptionData.updatedAt ? moment.utc(subscriptionData.updatedAt) : null
            }));
            return subscription;
        };
        return SubscriptionAdapter;
    }());
    exports.SubscriptionAdapter = SubscriptionAdapter;
});
define("services/SubscriptionService", ["require", "exports", "adapters/SubscriptionAdapter", "whatwg-fetch"], function (require, exports, SubscriptionAdapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionService = (function () {
        function SubscriptionService() {
        }
        SubscriptionService.subscribeToTopicByName = function (session, topicName) {
            return fetch(session.serviceBaseURL + "/subscribe", {
                method: 'POST',
                body: JSON.stringify({
                    topic: {
                        name: topicName,
                        createIfNotExist: true
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(response);
            });
        };
        SubscriptionService.unsubscribeFromTopic = function (session, topic) {
            return fetch(session.serviceBaseURL + "/unsubscribe", {
                method: 'POST',
                body: JSON.stringify({
                    topic: {
                        name: topic.name
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
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
                return SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(response);
            });
        };
        return SubscriptionService;
    }());
    exports.SubscriptionService = SubscriptionService;
});
define("stores/SubscriptionsStore", ["require", "exports", "lodash", "rxjs", "services/SubscriptionService", "services/MessagesService"], function (require, exports, _, rxjs_2, SubscriptionService_1, MessagesService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SubscriptionsStore = (function () {
        function SubscriptionsStore(client) {
            this._client = null;
            this._subscribedTopics = new rxjs_2.BehaviorSubject([]);
            this._client = client;
        }
        Object.defineProperty(SubscriptionsStore.prototype, "subscribedTopics", {
            get: function () {
                return this._subscribedTopics;
            },
            enumerable: true,
            configurable: true
        });
        SubscriptionsStore.prototype.subscribeToTopicByName = function (topicName) {
            return SubscriptionService_1.SubscriptionService.subscribeToTopicByName(this._client.session, topicName);
        };
        SubscriptionsStore.prototype.unsubscribeFromTopic = function (topic) {
            return SubscriptionService_1.SubscriptionService.unsubscribeFromTopic(this._client.session, topic);
        };
        SubscriptionsStore.prototype.addSubscribedTopic = function (topic) {
            var subscribedTopicsArray = this.subscribedTopics.getValue();
            var matchedTopic = _.find(subscribedTopicsArray, function (datum) {
                return datum.topicId === topic.topicId;
            });
            if (matchedTopic) {
                _.extend(matchedTopic, _.omit(topic, 'messages'));
            }
            else {
                subscribedTopicsArray.push(topic);
            }
            this.subscribedTopics.next(subscribedTopicsArray);
            return this.subscribedTopics;
        };
        SubscriptionsStore.prototype.removeSubscribedTopicById = function (topicId) {
            var subscribedTopicsArray = this.subscribedTopics.getValue();
            var matchedTopic = _.find(subscribedTopicsArray, function (datum) {
                return datum.topicId === topicId;
            });
            if (matchedTopic) {
                var matchedTopicIndex = _.indexOf(subscribedTopicsArray, matchedTopic);
                subscribedTopicsArray.splice(matchedTopicIndex, 1);
                matchedTopic.messages.complete();
            }
            this.subscribedTopics.next(subscribedTopicsArray);
            return this.subscribedTopics;
        };
        SubscriptionsStore.prototype.getTopicForName = function (topicName) {
            var subscribedTopicsArray = this.subscribedTopics.getValue();
            var matchedTopic = _.find(subscribedTopicsArray, function (datum) {
                return datum.name === topicName;
            });
            return matchedTopic || null;
        };
        SubscriptionsStore.prototype.getMessageStreamForTopic = function (topic) {
            return topic.messages;
        };
        SubscriptionsStore.prototype.getMessageStreamForTopicName = function (topicName) {
            var matchingTopic = this.getTopicForName(topicName);
            if (matchingTopic) {
                return matchingTopic.messages;
            }
            else {
                throw new Error("topic with name " + topicName + " not yet subscribed!");
            }
        };
        SubscriptionsStore.prototype.fetchMessagesForTopicSinceMessage = function (topic, sinceMessage) {
            return MessagesService_1.MessagesService.fetchMessagesForTopicSinceMessage(this._client.session, topic, sinceMessage)
                .then(function (messages) {
                topic.mergeMessages(messages);
                return messages;
            });
        };
        SubscriptionsStore.prototype.fetchMessagesForTopicTillMessage = function (topic, tillMessage) {
            return MessagesService_1.MessagesService.fetchMessagesForTopicTillMessage(this._client.session, topic, tillMessage)
                .then(function (messages) {
                topic.mergeMessages(messages);
                return messages;
            });
        };
        SubscriptionsStore.prototype.markAMessageAsRead = function (message) {
            return MessagesService_1.MessagesService.markAMessageAsRead(this._client.session, message)
                .then(function (readReceipt) {
                return message.topic.markAMessageAsRead(readReceipt);
            });
        };
        SubscriptionsStore.prototype.markMessagesSinceAMessageAsRead = function (sinceMessage) {
            return MessagesService_1.MessagesService.markMessagesSinceAMessageAsRead(this._client.session, sinceMessage)
                .then(function (readReceipts) {
                return sinceMessage.topic.markMessagesAsRead(readReceipts);
            });
        };
        SubscriptionsStore.prototype.markMessagesTillAMessageAsRead = function (tillMessage) {
            return MessagesService_1.MessagesService.markMessagesTillAMessageAsRead(this._client.session, tillMessage)
                .then(function (readReceipts) {
                return tillMessage.topic.markMessagesAsRead(readReceipts);
            });
        };
        SubscriptionsStore.prototype.reset = function () {
            _.forEach(this.subscribedTopics.getValue(), function (datum) {
                datum.reset();
            });
            this.subscribedTopics.next([]);
        };
        return SubscriptionsStore;
    }());
    exports.SubscriptionsStore = SubscriptionsStore;
});
define("models/SocketConnectionEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SocketConnectionEvents = (function () {
        function SocketConnectionEvents() {
        }
        Object.defineProperty(SocketConnectionEvents, "CONNECT", {
            get: function () {
                return 'connect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "ERROR", {
            get: function () {
                return 'error';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "DISCONNECT", {
            get: function () {
                return 'disconnect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_ATTEMPT", {
            get: function () {
                return 'reconnect_attempt';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECTING", {
            get: function () {
                return 'reconnecting';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT", {
            get: function () {
                return 'reconnect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_ERROR", {
            get: function () {
                return 'reconnect_error';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_FAILED", {
            get: function () {
                return 'reconnect_failed';
            },
            enumerable: true,
            configurable: true
        });
        return SocketConnectionEvents;
    }());
    exports.SocketConnectionEvents = SocketConnectionEvents;
});
define("models/ConnectionStatuses", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConnectionStatuses = (function () {
        function ConnectionStatuses() {
        }
        Object.defineProperty(ConnectionStatuses, "CONNECTING", {
            get: function () {
                return 'CONENCTING';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "CONNECTED", {
            get: function () {
                return 'CONNECTED';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "DISCONNECTED", {
            get: function () {
                return 'DISCONNECTED';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "ERRORED", {
            get: function () {
                return 'ERRORED';
            },
            enumerable: true,
            configurable: true
        });
        return ConnectionStatuses;
    }());
    exports.ConnectionStatuses = ConnectionStatuses;
});
define("models/TingEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TingEvents = (function () {
        function TingEvents() {
        }
        Object.defineProperty(TingEvents, "SUBSCRIPTION_LIVE", {
            get: function () {
                return 'subscription-live';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingEvents, "SUBSCRIPTION_OFF", {
            get: function () {
                return 'subscription-off';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingEvents, "MESSAGE", {
            get: function () {
                return 'message';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TingEvents, "MESSAGE_READ", {
            get: function () {
                return 'message-read';
            },
            enumerable: true,
            configurable: true
        });
        return TingEvents;
    }());
    exports.TingEvents = TingEvents;
});
define("TingClient", ["require", "exports", "eventemitter2", "socket.io-client", "rxjs", "models/Session", "services/AuthenticationService", "services/MessagesService", "stores/SubscriptionsStore", "ConnectionListeners", "models/SocketConnectionEvents", "models/ConnectionStatuses", "models/TingEvents", "whatwg-fetch"], function (require, exports, EventEmitter, io, rxjs_3, Session_1, AuthenticationService_1, MessagesService_2, SubscriptionsStore_1, ConnectionListeners_1, SocketConnectionEvents_1, ConnectionStatuses_1, TingEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
            _this._connectionStatus = new rxjs_3.BehaviorSubject(ConnectionStatuses_1.ConnectionStatuses.DISCONNECTED);
            _this._isConnected = new rxjs_3.BehaviorSubject(false);
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
            return MessagesService_2.MessagesService.publishMessage(this.session, topicName, messageBody, messageType);
        };
        TingClient.prototype.publishFile = function (topicName, file) {
            return MessagesService_2.MessagesService.publishFile(this.session, topicName, file);
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
define("ConnectionListeners", ["require", "exports", "models/SocketConnectionEvents", "models/ConnectionStatuses", "models/TingEvents", "adapters/TopicAdapter", "adapters/MessageAdapter", "adapters/ReadReceiptAdapter"], function (require, exports, SocketConnectionEvents_2, ConnectionStatuses_2, TingEvents_2, TopicAdapter_3, MessageAdapter_2, ReadReceiptAdapter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function onConnect(socket, clientFacade, subscriptionsStore) {
        function onError() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.ERRORED);
        }
        function onReconnectAttempt() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.CONNECTING);
        }
        function onReconnecting() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.CONNECTING);
        }
        function onReconnect() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.CONNECTED);
        }
        function onReconnectError() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.ERRORED);
        }
        function onReconnectFailed() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.ERRORED);
        }
        function onSubscriptionLive(topicData) {
            var topic = TopicAdapter_3.TopicAdapter.fromServerResponse(topicData);
            var matchedTopic = subscriptionsStore.getTopicForName(topic.name);
            if (!matchedTopic) {
                subscriptionsStore.addSubscribedTopic(topic);
            }
            clientFacade.emit('subscription-live', topic);
        }
        function onSubscriptionOff(topicData) {
            var topic = TopicAdapter_3.TopicAdapter.fromServerResponse(topicData);
            subscriptionsStore.removeSubscribedTopicById(topic.topicId);
            clientFacade.emit('subscription-off', topic);
        }
        function onMessage(data) {
            var topicName = data.topic.name;
            var message = MessageAdapter_2.MessageAdapter.fromServerResponse(data);
            var matchedTopic = subscriptionsStore.getTopicForName(topicName);
            if (matchedTopic) {
                message.topic = matchedTopic;
                matchedTopic.addMessage(message);
            }
            else {
                var topic = TopicAdapter_3.TopicAdapter.fromServerResponse(data.topic);
                message.topic = topic;
                topic.addMessage(message);
                subscriptionsStore.addSubscribedTopic(topic);
            }
            clientFacade.emit('message', message);
            clientFacade.emit("message:" + message.topic.name, message);
        }
        function onMessageRead(data) {
            var topicName = data.topic.name;
            var matchedTopic = subscriptionsStore.getTopicForName(topicName);
            if (matchedTopic) {
                var readReceipt = ReadReceiptAdapter_2.ReadReceiptAdapter.fromServerResponse(data.readReceipt);
                matchedTopic.markAMessageAsRead(readReceipt);
                clientFacade.emit('message-read', matchedTopic, readReceipt);
                clientFacade.emit("message-read:" + matchedTopic.name, readReceipt);
            }
        }
        function onDisconnect() {
            clientFacade.__setConnectionStatus(ConnectionStatuses_2.ConnectionStatuses.DISCONNECTED);
        }
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.ERROR, onError);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.DISCONNECT, onDisconnect);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.RECONNECT_ATTEMPT, onReconnectAttempt);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.RECONNECTING, onReconnecting);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.RECONNECT, onReconnect);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.RECONNECT_ERROR, onReconnectError);
        socket.on(SocketConnectionEvents_2.SocketConnectionEvents.RECONNECT_FAILED, onReconnectFailed);
        socket.on(TingEvents_2.TingEvents.SUBSCRIPTION_LIVE, onSubscriptionLive);
        socket.on(TingEvents_2.TingEvents.SUBSCRIPTION_OFF, onSubscriptionOff);
        socket.on(TingEvents_2.TingEvents.MESSAGE, onMessage);
        socket.on(TingEvents_2.TingEvents.MESSAGE_READ, onMessageRead);
    }
    exports.onConnect = onConnect;
});
//# sourceMappingURL=TingClient.amd.js.map