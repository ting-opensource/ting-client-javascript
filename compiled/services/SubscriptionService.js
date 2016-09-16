System.register(['whatwg-fetch', '../adapters/SubscriptionAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SubscriptionAdapter_1;
    var SubscriptionService;
    return {
        setters:[
            function (_1) {},
            function (SubscriptionAdapter_1_1) {
                SubscriptionAdapter_1 = SubscriptionAdapter_1_1;
            }],
        execute: function() {
            SubscriptionService = (function () {
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
            exports_1("SubscriptionService", SubscriptionService);
        }
    }
});
//# sourceMappingURL=SubscriptionService.js.map