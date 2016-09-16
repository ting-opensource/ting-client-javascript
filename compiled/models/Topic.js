System.register(['lodash', 'rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, rxjs_1;
    var BUFFER_SIZE, Topic;
    return {
        setters:[
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }],
        execute: function() {
            BUFFER_SIZE = 999;
            Topic = (function () {
                function Topic(data) {
                    this.topicId = '';
                    this.name = '';
                    this.isActive = false;
                    this.createdBy = '';
                    this.createdAt = null;
                    this.updatedBy = '';
                    this.updatedAt = null;
                    this.messages = new rxjs_1.BehaviorSubject([]);
                    for (var key in data) {
                        this[key] = data[key];
                    }
                }
                Topic.prototype.addMessage = function (message) {
                    var messages = this.messages.getValue();
                    messages.push(message);
                    this.messages.next(messages);
                    return this.messages;
                };
                Topic.prototype.mergeMessages = function (incomingMessages) {
                    var existingMesssages = this.messages.getValue();
                    var mergedMessages = lodash_1.default.unionBy(incomingMessages, existingMesssages, 'messageId');
                    this.messages.next(mergedMessages);
                    return this.messages;
                };
                return Topic;
            }());
            exports_1("Topic", Topic);
        }
    }
});
//# sourceMappingURL=Topic.js.map