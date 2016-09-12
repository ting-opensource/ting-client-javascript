System.register(['moment', 'lodash', '../models/Subscription', './TopicAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment_1, lodash_1, Subscription_1, TopicAdapter_1;
    var SubscriptionAdapter;
    return {
        setters:[
            function (moment_1_1) {
                moment_1 = moment_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (Subscription_1_1) {
                Subscription_1 = Subscription_1_1;
            },
            function (TopicAdapter_1_1) {
                TopicAdapter_1 = TopicAdapter_1_1;
            }],
        execute: function() {
            SubscriptionAdapter = (function () {
                function SubscriptionAdapter() {
                }
                SubscriptionAdapter.fromServerResponse = function (subscriptionData) {
                    var subscription = new Subscription_1.Subscription(lodash_1.default.extend({}, subscriptionData, {
                        topic: TopicAdapter_1.TopicAdapter.fromServerResponse(subscriptionData.topic),
                        createdAt: subscriptionData.createdAt ? moment_1.default.utc(subscriptionData.createdAt) : null,
                        updatedAt: subscriptionData.updatedAt ? moment_1.default.utc(subscriptionData.updatedAt) : null
                    }));
                    return subscription;
                };
                return SubscriptionAdapter;
            }());
            exports_1("SubscriptionAdapter", SubscriptionAdapter);
        }
    }
});
//# sourceMappingURL=SubscriptionAdapter.js.map