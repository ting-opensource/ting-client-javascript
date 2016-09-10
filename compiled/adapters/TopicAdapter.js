System.register(['moment', 'lodash', '../models/Topic'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, lodash_1, Topic_1;
    var TopicAdapter;
    return {
        setters:[
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (Topic_1_1) {
                Topic_1 = Topic_1_1;
            }],
        execute: function() {
            TopicAdapter = (function () {
                function TopicAdapter() {
                }
                TopicAdapter.fromServerResponse = function (topicData) {
                    var topic = new Topic_1.Topic(lodash_1.default.extend({}, topicData, {
                        createdAt: topicData.createdAt ? moment_1.default.utc(topicData.createdAt) : null,
                        updatedAt: topicData.updatedAt ? moment_1.default.utc(topicData.updatedAt) : null
                    }));
                    return topic;
                };
                return TopicAdapter;
            }());
            exports_1("TopicAdapter", TopicAdapter);
        }
    }
});
//# sourceMappingURL=TopicAdapter.js.map