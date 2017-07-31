(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "lodash", "rxjs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lodash_1 = require("lodash");
    var rxjs_1 = require("rxjs");
    var BUFFER_SIZE = 999;
    var Topic = (function () {
        function Topic(data) {
            var _this = this;
            this.topicId = '';
            this.name = '';
            this.isActive = false;
            this.createdBy = '';
            this.createdAt = null;
            this.updatedBy = '';
            this.updatedAt = null;
            this._unreadCountSubscription = null;
            this._messages = new rxjs_1.BehaviorSubject([]);
            this._unreadMessagesCount = new rxjs_1.BehaviorSubject(-1);
            for (var key in data) {
                this[key] = data[key];
            }
            this._unreadCountSubscription = this._messages.subscribe(function (messages) {
                var unreadMessages = lodash_1.chain(messages).filter(function (datum) {
                    return !datum.isRead;
                }).value();
                _this.unreadMessagesCount.next(unreadMessages.length);
            });
        }
        Object.defineProperty(Topic.prototype, "messages", {
            get: function () {
                return this._messages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Topic.prototype, "unreadMessagesCount", {
            get: function () {
                return this._unreadMessagesCount;
            },
            enumerable: true,
            configurable: true
        });
        Topic.prototype.addMessage = function (message) {
            return this.mergeMessages([message]);
        };
        Topic.prototype.mergeMessages = function (incomingMessages) {
            var existingMesssages = this.messages.getValue();
            var mergedMessages = lodash_1.unionBy(incomingMessages, existingMesssages, 'messageId');
            mergedMessages = lodash_1.sortBy(mergedMessages, function (datum) {
                return -(datum.updatedAt.valueOf());
            });
            this.messages.next(mergedMessages);
            return this.messages;
        };
        Topic.prototype.markAMessageAsRead = function (readReceipt) {
            return this.markMessagesAsRead([readReceipt]);
        };
        Topic.prototype.markMessagesAsRead = function (readReceipts) {
            var existingMesssages = this.messages.getValue();
            var readReceiptsKeyedByMessageId = lodash_1.keyBy(readReceipts, function (datum) {
                return datum.messageId;
            });
            var messageIdsInReadReceipts = lodash_1.keys(readReceiptsKeyedByMessageId);
            lodash_1.forEach(existingMesssages, function (datum) {
                if (lodash_1.indexOf(messageIdsInReadReceipts, datum.messageId) > -1) {
                    lodash_1.extend(datum, readReceiptsKeyedByMessageId[datum.messageId]);
                }
            });
            this.messages.next(existingMesssages);
            return this.messages;
        };
        Topic.prototype.reset = function () {
            this._unreadCountSubscription.unsubscribe();
            this.messages.next([]);
            this.unreadMessagesCount.next(0);
        };
        return Topic;
    }());
    exports.Topic = Topic;
});
//# sourceMappingURL=Topic.js.map