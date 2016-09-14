System.register(['moment', 'lodash', '../models/Message', './TopicAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, lodash_1, Message_1, TopicAdapter_1;
    var MessageAdapter;
    return {
        setters:[
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (Message_1_1) {
                Message_1 = Message_1_1;
            },
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            }],
        execute: function() {
            MessageAdapter = (function () {
                function MessageAdapter() {
                }
                MessageAdapter.fromServerResponse = function (messageData) {
                    var message = new Message_1.Message(lodash_1.default.extend({}, messageData, {
                        topic: TopicAdapter_1.TopicAdapter.fromServerResponse(messageData.topic),
                        createdAt: messageData.createdAt ? moment_1.default.utc(messageData.createdAt) : null,
                        updatedAt: messageData.updatedAt ? moment_1.default.utc(messageData.updatedAt) : null
                    }));
                    return message;
                };
                return MessageAdapter;
            }());
            exports_1("MessageAdapter", MessageAdapter);
        }
    }
});
//# sourceMappingURL=MessageAdapter.js.map