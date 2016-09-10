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
                    this._subscribedTopics = new Array();
                    this._subscribedTopicsObservable = new rxjs_1.BehaviorSubject(this.subscribedTopics);
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
                Object.defineProperty(SubscriptionsStore.prototype, "subscribedTopicsObservable", {
                    get: function () {
                        return this._subscribedTopicsObservable;
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
                    this.subscribedTopics.push(topic);
                    this.subscribedTopicsObservable.next(this.subscribedTopics);
                };
                SubscriptionsStore.prototype.getTopicForName = function (topicName) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        resolve(lodash_1.default.find(_this.subscribedTopics, function (datum) {
                            return datum.name === topicName;
                        }));
                    });
                };
                return SubscriptionsStore;
            }());
            exports_1("SubscriptionsStore", SubscriptionsStore);
        }
    }
});
//# sourceMappingURL=SubscriptionsStore.js.map