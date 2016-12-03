(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'lodash', 'rxjs', '../services/SubscriptionService', '../services/MessagesService'], factory);
    }
})(function (require, exports) {
    "use strict";
    var _ = require('lodash');
    var rxjs_1 = require('rxjs');
    var SubscriptionService_1 = require('../services/SubscriptionService');
    var MessagesService_1 = require('../services/MessagesService');
    var SubscriptionsStore = (function () {
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
        return SubscriptionsStore;
    }());
    exports.SubscriptionsStore = SubscriptionsStore;
});
//# sourceMappingURL=SubscriptionsStore.js.map