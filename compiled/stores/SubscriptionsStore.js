System.register(['lodash', 'rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, rxjs_1;
    var _instance, SingletonEnforcer, SubscriptionsStore;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }],
        execute: function() {
            _instance = null;
            SingletonEnforcer = (function () {
                function SingletonEnforcer() {
                }
                return SingletonEnforcer;
            }());
            SubscriptionsStore = (function () {
                function SubscriptionsStore(enforcer) {
                    this._subscribedTopics = new rxjs_1.BehaviorSubject([]);
                    if (!enforcer || !(enforcer instanceof SingletonEnforcer)) {
                        throw new Error("This is a Singleton Class. Use getInstance() method instead.");
                    }
                }
                Object.defineProperty(SubscriptionsStore.prototype, "subscribedTopics", {
                    get: function () {
                        return this._subscribedTopics;
                    },
                    enumerable: true,
                    configurable: true
                });
                SubscriptionsStore.getInstance = function () {
                    if (!_instance) {
                        _instance = new SubscriptionsStore(new SingletonEnforcer());
                    }
                    return _instance;
                };
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
                return SubscriptionsStore;
            }());
            exports_1("SubscriptionsStore", SubscriptionsStore);
        }
    }
});
//# sourceMappingURL=SubscriptionsStore.js.map