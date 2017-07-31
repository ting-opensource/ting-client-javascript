(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "moment", "lodash", "../models/Message", "../models/FileMetadata", "../models/MessageTypes", "./TopicAdapter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var moment = require("moment");
    var lodash_1 = require("lodash");
    var Message_1 = require("../models/Message");
    var FileMetadata_1 = require("../models/FileMetadata");
    var MessageTypes_1 = require("../models/MessageTypes");
    var TopicAdapter_1 = require("./TopicAdapter");
    var MessageAdapter = (function () {
        function MessageAdapter() {
        }
        MessageAdapter.fileMetadataFromServerResponse = function (fileMetadataData) {
            return new FileMetadata_1.FileMetadata(lodash_1.extend({}, fileMetadataData, {
                createdAt: fileMetadataData.createdAt ? moment.utc(fileMetadataData.createdAt) : null,
                updatedAt: fileMetadataData.updatedAt ? moment.utc(fileMetadataData.updatedAt) : null,
            }));
        };
        MessageAdapter.fromServerResponse = function (messageData) {
            var messageBody = '';
            var type = messageData.type;
            try {
                if (messageData.type === MessageTypes_1.MessageTypes.JSON) {
                    messageBody = JSON.parse(messageData.body);
                }
                else if (messageData.type === MessageTypes_1.MessageTypes.FILE) {
                    var fileMetadataData = JSON.parse(messageData.body);
                    messageBody = MessageAdapter.fileMetadataFromServerResponse(fileMetadataData);
                }
                else {
                    messageBody = messageData.body;
                }
            }
            catch (error) {
                messageBody = messageData.body;
                type = MessageTypes_1.MessageTypes.TEXT;
            }
            var message = new Message_1.Message(lodash_1.extend({}, messageData, {
                type: type,
                body: messageBody,
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