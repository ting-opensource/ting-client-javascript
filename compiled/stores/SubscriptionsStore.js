System.register(['lodash', 'rxjs', '../services/SubscriptionService', '../services/MessagesService'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, rxjs_1, SubscriptionService_1, MessagesService_1;
    var SubscriptionsStore;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            },
            function (SubscriptionService_1_1) {
                SubscriptionService_1 = SubscriptionService_1_1;
            },
            function (MessagesService_1_1) {
                MessagesService_1 = MessagesService_1_1;
            }],
        execute: function() {
            SubscriptionsStore = (function () {
                function SubscriptionsStore(client) {
                    this._client = null;
                    this._subscribedTopics = new rxjs_1.BehaviorSubject([]);
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
                    var matchedTopic = lodash_1.default.find(subscribedTopicsArray, function (datum) {
                        return datum.topicId === topic.topicId;
                    });
                    if (matchedTopic) {
                        lodash_1.default.extend(matchedTopic, lodash_1.default.omit(topic, 'messages'));
                    }
                    else {
                        subscribedTopicsArray.push(topic);
                    }
                    this.subscribedTopics.next(subscribedTopicsArray);
                    return this.subscribedTopics;
                };
                SubscriptionsStore.prototype.removeSubscribedTopicById = function (topicId) {
                    var subscribedTopicsArray = this.subscribedTopics.getValue();
                    var matchedTopic = lodash_1.default.find(subscribedTopicsArray, function (datum) {
                        return datum.topicId === topicId;
                    });
                    if (matchedTopic) {
                        var matchedTopicIndex = lodash_1.default.indexOf(subscribedTopicsArray, matchedTopic);
                        subscribedTopicsArray.splice(matchedTopicIndex, 1);
                        matchedTopic.messages.complete();
                    }
                    this.subscribedTopics.next(subscribedTopicsArray);
                    return this.subscribedTopics;
                };
                SubscriptionsStore.prototype.getTopicForName = function (topicName) {
                    var subscribedTopicsArray = this.subscribedTopics.getValue();
                    var matchedTopic = lodash_1.default.find(subscribedTopicsArray, function (datum) {
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
                return SubscriptionsStore;
            }());
            exports_1("SubscriptionsStore", SubscriptionsStore);
        }
    }
});
//# sourceMappingURL=SubscriptionsStore.js.map