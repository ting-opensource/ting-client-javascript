System.register(['lodash', 'rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, rxjs_1;
    var _instance, SingletonEnforcer, TopicStore;
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
            TopicStore = (function () {
                function TopicStore(enforcer) {
                    this._topics = rxjs_1.Observable.create(function (observer) {
                    });
                    if (!enforcer || !(enforcer instanceof SingletonEnforcer)) {
                        throw new Error("This is a Singleton Class. Use getInstance() method instead.");
                    }
                }
                TopicStore.getInstance = function () {
                    if (!_instance) {
                        _instance = new TopicStore(new SingletonEnforcer());
                    }
                    return _instance;
                };
                TopicStore.prototype.getTopicForName = function (topicName) {
                    var matchedTopic = lodash_1.default.find(this._topics, function (datum) {
                        return datum.name === topicName;
                    });
                    return matchedTopic || null;
                };
                return TopicStore;
            }());
            exports_1("TopicStore", TopicStore);
        }
    }
});
//# sourceMappingURL=TopicStore.js.map