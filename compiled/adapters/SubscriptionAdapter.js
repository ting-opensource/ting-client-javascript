(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "moment", "lodash", "../models/Subscription", "./TopicAdapter"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var moment = require("moment");
    var lodash_1 = require("lodash");
    var Subscription_1 = require("../models/Subscription");
    var TopicAdapter_1 = require("./TopicAdapter");
    var SubscriptionAdapter = (function () {
        function SubscriptionAdapter() {
        }
        SubscriptionAdapter.fromServerResponse = function (subscriptionData) {
            var subscription = new Subscription_1.Subscription(lodash_1.extend({}, subscriptionData, {
                topic: TopicAdapter_1.TopicAdapter.fromServerResponse(subscriptionData.topic),
                createdAt: subscriptionData.createdAt ? moment.utc(subscriptionData.createdAt) : null,
                updatedAt: subscriptionData.updatedAt ? moment.utc(subscriptionData.updatedAt) : null
            }));
            return subscription;
        };
        return SubscriptionAdapter;
    }());
    exports.SubscriptionAdapter = SubscriptionAdapter;
});
//# sourceMappingURL=SubscriptionAdapter.js.map