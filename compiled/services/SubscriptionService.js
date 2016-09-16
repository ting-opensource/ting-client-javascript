(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'whatwg-fetch', '../adapters/SubscriptionAdapter'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var SubscriptionAdapter_1 = require('../adapters/SubscriptionAdapter');
    var SubscriptionService = (function () {
        function SubscriptionService() {
        }
        SubscriptionService.subscribeToTopicByName = function (session, topicName) {
            return fetch(session.serviceBaseURL + "/subscribe", {
                method: 'POST',
                body: JSON.stringify({
                    topic: {
                        name: topicName,
                        createIfNotExist: true
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
                }
            })
                .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    var error = new Error(response.statusText);
                    throw error;
                }
            })
                .then(function (response) {
                return SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(response);
            });
        };
        SubscriptionService.unsubscribeFromTopic = function (session, topic) {
            return fetch(session.serviceBaseURL + "/unsubscribe", {
                method: 'POST',
                body: JSON.stringify({
                    topic: {
                        name: topic.name
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + session.token
                }
            })
                .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    var error = new Error(response.statusText);
                    throw error;
                }
            })
                .then(function (response) {
                return SubscriptionAdapter_1.SubscriptionAdapter.fromServerResponse(response);
            });
        };
        return SubscriptionService;
    }());
    exports.SubscriptionService = SubscriptionService;
});
//# sourceMappingURL=SubscriptionService.js.map