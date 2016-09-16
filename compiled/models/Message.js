System.register(['./MessageTypes'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MessageTypes_1;
    var Message;
    return {
        setters:[
            function (MessageTypes_1_1) {
                MessageTypes_1 = MessageTypes_1_1;
            }],
        execute: function() {
            Message = (function () {
                function Message(data) {
                    this.messageId = '';
                    this.topic = null;
                    this.publisher = '';
                    this.type = MessageTypes_1.MessageTypes.TEXT;
                    this.body = '';
                    this.createdAt = null;
                    this.updatedBy = '';
                    this.updatedAt = null;
                    for (var key in data) {
                        this[key] = data[key];
                    }
                }
                return Message;
            }());
            exports_1("Message", Message);
        }
    }
});
//# sourceMappingURL=Message.js.map