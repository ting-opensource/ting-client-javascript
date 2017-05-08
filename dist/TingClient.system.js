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
System.register("models/Session", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Session;
    return {
        setters: [],
        execute: function () {
            Session = (function () {
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
            exports_1("Session", Session);
        }
    };
});
System.register("models/MessageTypes", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var MessageTypes;
    return {
        setters: [],
        execute: function () {
            MessageTypes = (function () {
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
            exports_2("MessageTypes", MessageTypes);
        }
    };
});
System.register("models/Message", ["models/MessageTypes"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var MessageTypes_1, Message;
    return {
        setters: [
            function (MessageTypes_1_1) {
                MessageTypes_1 = MessageTypes_1_1;
            }
        ],
        execute: function () {
            Message = (function () {
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
            exports_3("Message", Message);
        }
    };
});
System.register("models/ReadReceipt", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var ReadReceipt;
    return {
        setters: [],
        execute: function () {
            ReadReceipt = (function () {
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
            exports_4("ReadReceipt", ReadReceipt);
        }
    };
});
System.register("models/Topic", ["lodash", "rxjs"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var _, rxjs_1, BUFFER_SIZE, Topic;
    return {
        setters: [
            function (_1) {
                _ = _1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }
        ],
        execute: function () {
            BUFFER_SIZE = 999;
            Topic = (function () {
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
            exports_5("Topic", Topic);
        }
    };
});
System.register("models/Subscription", [], function (exports_6, context_6) {
    'use strict';
    var __moduleName = context_6 && context_6.id;
    var Subscription;
    return {
        setters: [],
        execute: function () {
            Subscription = (function () {
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
            exports_6("Subscription", Subscription);
        }
    };
});
System.register("models/FileMetadata", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var FileMetadata;
    return {
        setters: [],
        execute: function () {
            FileMetadata = (function () {
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
            exports_7("FileMetadata", FileMetadata);
        }
    };
});
System.register("utils/Base64Encoder", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var Base64Encoder;
    return {
        setters: [],
        execute: function () {
            Base64Encoder = (function () {
                function Base64Encoder() {
                }
                Base64Encoder.encode = function (data) {
                    return window.btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, pattern) {
                        return String.fromCharCode(parseInt('0x' + pattern));
                    }));
                };
                return Base64Encoder;
            }());
            exports_8("Base64Encoder", Base64Encoder);
        }
    };
});
System.register("services/AuthenticationService", ["whatwg-fetch", "utils/Base64Encoder"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var Base64Encoder_1, AuthenticationService;
    return {
        setters: [
            function (_2) {
            },
            function (Base64Encoder_1_1) {
                Base64Encoder_1 = Base64Encoder_1_1;
            }
        ],
        execute: function () {
            AuthenticationService = (function () {
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
            exports_9("AuthenticationService", AuthenticationService);
        }
    };
});
System.register("adapters/TopicAdapter", ["moment", "lodash", "models/Topic"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var moment, _, Topic_1, TopicAdapter;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            },
            function (_3) {
                _ = _3;
            },
            function (Topic_1_1) {
                Topic_1 = Topic_1_1;
            }
        ],
        execute: function () {
            TopicAdapter = (function () {
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
            exports_10("TopicAdapter", TopicAdapter);
        }
    };
});
System.register("adapters/MessageAdapter", ["moment", "lodash", "models/Message", "models/FileMetadata", "models/MessageTypes", "adapters/TopicAdapter"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var moment, _, Message_1, FileMetadata_1, MessageTypes_2, TopicAdapter_1, MessageAdapter;
    return {
        setters: [
            function (moment_2) {
                moment = moment_2;
            },
            function (_4) {
                _ = _4;
            },
            function (Message_1_1) {
                Message_1 = Message_1_1;
            },
            function (FileMetadata_1_1) {
                FileMetadata_1 = FileMetadata_1_1;
            },
            function (MessageTypes_2_1) {
                MessageTypes_2 = MessageTypes_2_1;
            },
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            }
        ],
        execute: function () {
            MessageAdapter = (function () {
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
            exports_11("MessageAdapter", MessageAdapter);
        }
    };
});
System.register("adapters/ReadReceiptAdapter", ["moment", "lodash", "models/ReadReceipt"], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var moment, _, ReadReceipt_1, ReadReceiptAdapter;
    return {
        setters: [
            function (moment_3) {
                moment = moment_3;
            },
            function (_5) {
                _ = _5;
            },
            function (ReadReceipt_1_1) {
                ReadReceipt_1 = ReadReceipt_1_1;
            }
        ],
        execute: function () {
            ReadReceiptAdapter = (function () {
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
            exports_12("ReadReceiptAdapter", ReadReceiptAdapter);
        }
    };
});
System.register("services/MessagesService", ["whatwg-fetch", "lodash", "models/MessageTypes", "adapters/MessageAdapter", "adapters/ReadReceiptAdapter"], function (exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var _, MessageTypes_3, MessageAdapter_1, ReadReceiptAdapter_1, DEFAULT_PAGE_SIZE, MessagesService;
    return {
        setters: [
            function (_6) {
            },
            function (_7) {
                _ = _7;
            },
            function (MessageTypes_3_1) {
                MessageTypes_3 = MessageTypes_3_1;
            },
            function (MessageAdapter_1_1) {
                MessageAdapter_1 = MessageAdapter_1_1;
            },
            function (ReadReceiptAdapter_1_1) {
                ReadReceiptAdapter_1 = ReadReceiptAdapter_1_1;
            }
        ],
        execute: function () {
            DEFAULT_PAGE_SIZE = 100;
            MessagesService = (function () {
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
                            'Content-Type': 'application/json',
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
            exports_13("MessagesService", MessagesService);
        }
    };
});
System.register("adapters/SubscriptionAdapter", ["moment", "lodash", "models/Subscription", "adapters/TopicAdapter"], function (exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var moment, _, Subscription_1, TopicAdapter_2, SubscriptionAdapter;
    return {
        setters: [
            function (moment_4) {
                moment = moment_4;
            },
            function (_8) {
                _ = _8;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            },
            function (TopicAdapter_2_1) {
                TopicAdapter_2 = TopicAdapter_2_1;
            }
        ],
        execute: function () {
            SubscriptionAdapter = (function () {
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
            exports_14("SubscriptionAdapter", SubscriptionAdapter);
        }
    };
});
System.register("services/SubscriptionService", ["whatwg-fetch", "adapters/SubscriptionAdapter"], function (exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var SubscriptionAdapter_1, SubscriptionService;
    return {
        setters: [
            function (_9) {
            },
            function (SubscriptionAdapter_1_1) {
                SubscriptionAdapter_1 = SubscriptionAdapter_1_1;
            }
        ],
        execute: function () {
            SubscriptionService = (function () {
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
            exports_15("SubscriptionService", SubscriptionService);
        }
    };
});
System.register("stores/SubscriptionsStore", ["lodash", "rxjs", "services/SubscriptionService", "services/MessagesService"], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var _, rxjs_2, SubscriptionService_1, MessagesService_1, SubscriptionsStore;
    return {
        setters: [
            function (_10) {
                _ = _10;
            },
            function (rxjs_2_1) {
                rxjs_2 = rxjs_2_1;
            },
            function (SubscriptionService_1_1) {
                SubscriptionService_1 = SubscriptionService_1_1;
            },
            function (MessagesService_1_1) {
                MessagesService_1 = MessagesService_1_1;
            }
        ],
        execute: function () {
            SubscriptionsStore = (function () {
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
            exports_16("SubscriptionsStore", SubscriptionsStore);
        }
    };
});
System.register("models/SocketConnectionEvents", [], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var SocketConnectionEvents;
    return {
        setters: [],
        execute: function () {
            SocketConnectionEvents = (function () {
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
            exports_17("SocketConnectionEvents", SocketConnectionEvents);
        }
    };
});
System.register("models/ConnectionStatuses", [], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var ConnectionStatuses;
    return {
        setters: [],
        execute: function () {
            ConnectionStatuses = (function () {
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
            exports_18("ConnectionStatuses", ConnectionStatuses);
        }
    };
});
System.register("models/TingEvents", [], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var TingEvents;
    return {
        setters: [],
        execute: function () {
            TingEvents = (function () {
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
            exports_19("TingEvents", TingEvents);
        }
    };
});
System.register("TingClient", ["whatwg-fetch", "eventemitter2", "socket.io-client", "rxjs", "models/Session", "services/AuthenticationService", "services/MessagesService", "stores/SubscriptionsStore", "ConnectionListeners", "models/SocketConnectionEvents", "models/ConnectionStatuses", "models/TingEvents"], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var EventEmitter, io, rxjs_3, Session_1, AuthenticationService_1, MessagesService_2, SubscriptionsStore_1, ConnectionListeners_1, SocketConnectionEvents_1, ConnectionStatuses_1, TingEvents_1, _instance, SingletonEnforcer, TingClient;
    return {
        setters: [
            function (_11) {
            },
            function (EventEmitter_1) {
                EventEmitter = EventEmitter_1;
            },
            function (io_1) {
                io = io_1;
            },
            function (rxjs_3_1) {
                rxjs_3 = rxjs_3_1;
            },
            function (Session_1_1) {
                Session_1 = Session_1_1;
            },
            function (AuthenticationService_1_1) {
                AuthenticationService_1 = AuthenticationService_1_1;
            },
            function (MessagesService_2_1) {
                MessagesService_2 = MessagesService_2_1;
            },
            function (SubscriptionsStore_1_1) {
                SubscriptionsStore_1 = SubscriptionsStore_1_1;
            },
            function (ConnectionListeners_1_1) {
                ConnectionListeners_1 = ConnectionListeners_1_1;
            },
            function (SocketConnectionEvents_1_1) {
                SocketConnectionEvents_1 = SocketConnectionEvents_1_1;
            },
            function (ConnectionStatuses_1_1) {
                ConnectionStatuses_1 = ConnectionStatuses_1_1;
            },
            function (TingEvents_1_1) {
                TingEvents_1 = TingEvents_1_1;
            }
        ],
        execute: function () {
            _instance = null;
            SingletonEnforcer = (function () {
                function SingletonEnforcer() {
                }
                return SingletonEnforcer;
            }());
            TingClient = (function (_super) {
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
            exports_20("TingClient", TingClient);
        }
    };
});
System.register("ConnectionListeners", ["models/SocketConnectionEvents", "models/ConnectionStatuses", "models/TingEvents", "adapters/TopicAdapter", "adapters/MessageAdapter", "adapters/ReadReceiptAdapter"], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
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
    exports_21("onConnect", onConnect);
    var SocketConnectionEvents_2, ConnectionStatuses_2, TingEvents_2, TopicAdapter_3, MessageAdapter_2, ReadReceiptAdapter_2;
    return {
        setters: [
            function (SocketConnectionEvents_2_1) {
                SocketConnectionEvents_2 = SocketConnectionEvents_2_1;
            },
            function (ConnectionStatuses_2_1) {
                ConnectionStatuses_2 = ConnectionStatuses_2_1;
            },
            function (TingEvents_2_1) {
                TingEvents_2 = TingEvents_2_1;
            },
            function (TopicAdapter_3_1) {
                TopicAdapter_3 = TopicAdapter_3_1;
            },
            function (MessageAdapter_2_1) {
                MessageAdapter_2 = MessageAdapter_2_1;
            },
            function (ReadReceiptAdapter_2_1) {
                ReadReceiptAdapter_2 = ReadReceiptAdapter_2_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=TingClient.system.js.map