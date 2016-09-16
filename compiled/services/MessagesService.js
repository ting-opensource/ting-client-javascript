System.register(['whatwg-fetch', 'lodash', 'query-string', '../adapters/MessageAdapter'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lodash_1, query_string_1, MessageAdapter_1;
    var MessagesService;
    return {
        setters:[
            function (_1) {},
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (query_string_1_1) {
                query_string_1 = query_string_1_1;
            },
            function (MessageAdapter_1_1) {
                MessageAdapter_1 = MessageAdapter_1_1;
            }],
        execute: function() {
            MessagesService = (function () {
                function MessagesService() {
                }
                MessagesService.fetchMessagesForTopicSinceMessage = function (session, topic, message) {
                    var queryStringParams = {
                        topic: topic.name,
                        sinceMessageId: message.messageId,
                        pageSize: 100
                    };
                    var url = session.serviceBaseURL + "/messages?" + query_string_1.default.stringify(queryStringParams);
                    return fetch(url, {
                        method: 'GET',
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
                        return lodash_1.default.map(response, function (datum) {
                            return MessageAdapter_1.MessageAdapter.fromServerResponse(datum);
                        });
                    });
                };
                MessagesService.fetchMessagesForTopicTillMessage = function (session, topic, message) {
                    var queryStringParams = {
                        topic: topic.name,
                        tillMessageId: message.messageId,
                        pageSize: 100
                    };
                    var url = session.serviceBaseURL + "/messages?" + query_string_1.default.stringify(queryStringParams);
                    return fetch(url, {
                        method: 'GET',
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
                        return lodash_1.default.map(response, function (datum) {
                            return MessageAdapter_1.MessageAdapter.fromServerResponse(datum);
                        });
                    });
                };
                return MessagesService;
            }());
            exports_1("MessagesService", MessagesService);
        }
    }
});
//# sourceMappingURL=MessagesService.js.map