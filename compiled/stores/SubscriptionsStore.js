System.register(['lodash', 'rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, rxjs_1;
    var SubscriptionsStore;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }],
        execute: function() {
            SubscriptionsStore = (function () {
                function SubscriptionsStore() {
                    this._subscribedTopics = new rxjs_1.BehaviorSubject([]);
                }
                Object.defineProperty(SubscriptionsStore.prototype, "subscribedTopics", {
                    get: function () {
                        return this._subscribedTopics;
                    },
                    enumerable: true,
                    configurable: true
                });
                SubscriptionsStore.prototype.addSubscribedTopic = function (topic) {
                    var subscribedTopicsArray = this.subscribedTopics.getValue();
                    subscribedTopicsArray.push(topic);
                    this.subscribedTopics.next(subscribedTopicsArray);
                };
                SubscriptionsStore.prototype.removeSubscribedTopicById = function (topicId) {
                    var subscribedTopicsArray = this.subscribedTopics.getValue();
                    var matchedTopic = lodash_1.default.find(subscribedTopicsArray, function (datum) {
                        return datum.topicId === topicId;
                    });
                    var matchedTopicIndex = lodash_1.default.indexOf(subscribedTopicsArray, matchedTopic);
                    if (matchedTopicIndex >= 0) {
                        subscribedTopicsArray.splice(matchedTopicIndex, 1);
                    }
                    this.subscribedTopics.next(subscribedTopicsArray);
                };
                SubscriptionsStore.prototype.getTopicForName = function (topicName) {
                    var subscribedTopicsArray = this.subscribedTopics.getValue();
                    var matchedTopic = lodash_1.default.find(subscribedTopicsArray, function (datum) {
                        return datum.name === topicName;
                    });
                    return matchedTopic || null;
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
                return SubscriptionsStore;
            }());
            exports_1("SubscriptionsStore", SubscriptionsStore);
        }
    }
});
//# sourceMappingURL=SubscriptionsStore.js.map