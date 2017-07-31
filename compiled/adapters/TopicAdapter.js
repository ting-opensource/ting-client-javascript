(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "moment", "lodash", "../models/Topic"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var moment = require("moment");
    var lodash_1 = require("lodash");
    var Topic_1 = require("../models/Topic");
    var TopicAdapter = (function () {
        function TopicAdapter() {
        }
        TopicAdapter.fromServerResponse = function (topicData) {
            var topic = new Topic_1.Topic(lodash_1.extend({}, topicData, {
                createdAt: topicData.createdAt ? moment.utc(topicData.createdAt) : null,
                updatedAt: topicData.updatedAt ? moment.utc(topicData.updatedAt) : null
            }));
            return topic;
        };
        return TopicAdapter;
    }());
    exports.TopicAdapter = TopicAdapter;
});
//# sourceMappingURL=TopicAdapter.js.map