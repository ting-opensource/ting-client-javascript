(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./MessageTypes"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageTypes_1 = require("./MessageTypes");
    var Message = (function () {
        function Message(data) {
            this.messageId = '';
            this.topic = null;
            this.publisher = '';
            this.type = MessageTypes_1.MessageTypes.TEXT;
            this.body = '';
            this.createdAt = null;
            this.updatedBy = '';
            this.updatedAt = null;
            this.subscriber = '';
            this.readOn = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        Object.defineProperty(Message.prototype, "isRead", {
            get: function () {
                return this.readOn === null ? false : true;
            },
            enumerable: true,
            configurable: true
        });
        return Message;
    }());
    exports.Message = Message;
});
//# sourceMappingURL=Message.js.map