System.register(['rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var rxjs_1;
    var MessagesStore;
    return {
        setters:[
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }],
        execute: function() {
            MessagesStore = (function () {
                function MessagesStore() {
                    this._messages = new rxjs_1.BehaviorSubject([]);
                }
                Object.defineProperty(MessagesStore.prototype, "messages", {
                    get: function () {
                        return this._messages;
                    },
                    enumerable: true,
                    configurable: true
                });
                MessagesStore.prototype.addMessage = function (message) {
                    var messages = this.messages.getValue();
                    messages.push(message);
                    this.messages.next(messages);
                };
                MessagesStore.prototype.getMessageStreamForTopicName = function (topicName) {
                    return this.messages
                        .filter(function (datum, index) {
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