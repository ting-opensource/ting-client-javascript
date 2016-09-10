System.register(['rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var rxjs_1;
    var _instance, SingletonEnforcer, MessagesStore;
    return {
        setters:[
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
            MessagesStore = (function () {
                function MessagesStore(enforcer) {
                    this._messages = new rxjs_1.ReplaySubject();
                    if (!enforcer || !(enforcer instanceof SingletonEnforcer)) {
                        throw new Error("This is a Singleton Class. Use getInstance() method instead.");
                    }
                }
                Object.defineProperty(MessagesStore.prototype, "messages", {
                    get: function () {
                        return this._messages;
                    },
                    enumerable: true,
                    configurable: true
                });
                MessagesStore.getInstance = function () {
                    if (!_instance) {
                        _instance = new MessagesStore(new SingletonEnforcer());
                    }
                    return _instance;
                };
                MessagesStore.prototype.addMessage = function (message) {
                    this.messages.next(message);
                };
                MessagesStore.prototype.getMessageStreamForTopicName = function (topicName) {
                    return this.messages
                        .filter(function (datum) {
                        return datum.topic.name === topicName;
                    });
                };
                return MessagesStore;
            }());
            exports_1("MessagesStore", MessagesStore);
        }
    }
});
//# sourceMappingURL=MessagesStore.js.map