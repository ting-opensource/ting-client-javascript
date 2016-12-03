(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'moment', 'lodash', '../models/Message', './TopicAdapter'], factory);
    }
})(function (require, exports) {
    "use strict";
    var moment = require('moment');
    var _ = require('lodash');
    var Message_1 = require('../models/Message');
    var TopicAdapter_1 = require('./TopicAdapter');
    var MessageAdapter = (function () {
        function MessageAdapter() {
        }
        MessageAdapter.fromServerResponse = function (messageData) {
            var message = new Message_1.Message(_.extend({}, messageData, {
                topic: TopicAdapter_1.TopicAdapter.fromServerResponse(messageData.topic),
                createdAt: messageData.createdAt ? moment.utc(messageData.createdAt) : null,
                updatedAt: messageData.updatedAt ? moment.utc(messageData.updatedAt) : null,
                readOn: messageData.readOn ? moment.utc(messageData.updatedAt) : null,
            }));
            return message;
        };
        return MessageAdapter;
    }());
    exports.MessageAdapter = MessageAdapter;
});
//# sourceMappingURL=MessageAdapter.js.map