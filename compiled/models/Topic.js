(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'lodash', 'rxjs'], factory);
    }
})(function (require, exports) {
    "use strict";
    var _ = require('lodash');
    var rxjs_1 = require('rxjs');
    var BUFFER_SIZE = 999;
    var Topic = (function () {
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
            var mergedMessages = _.unionBy(incomingMessages, existingMesssages, 'messageId');
            this.messages.next(mergedMessages);
            return this.messages;
        };
        return Topic;
    }());
    exports.Topic = Topic;
});
//# sourceMappingURL=Topic.js.map