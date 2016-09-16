(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'whatwg-fetch', 'lodash', 'query-string', '../adapters/MessageAdapter'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var _ = require('lodash');
    var queryString = require('query-string');
    var MessageAdapter_1 = require('../adapters/MessageAdapter');
    var MessagesService = (function () {
        function MessagesService() {
        }
        MessagesService.fetchMessagesForTopicSinceMessage = function (session, topic, message) {
            var queryStringParams = {
                topic: topic.name,
                sinceMessageId: message.messageId,
                pageSize: 100
            };
            var url = session.serviceBaseURL + "/messages?" + queryString.stringify(queryStringParams);
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
                return _.map(response, function (datum) {
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
            var url = session.serviceBaseURL + "/messages?" + queryString.stringify(queryStringParams);
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
                return _.map(response, function (datum) {
                    return MessageAdapter_1.MessageAdapter.fromServerResponse(datum);
                });
            });
        };
        return MessagesService;
    }());
    exports.MessagesService = MessagesService;
});
//# sourceMappingURL=MessagesService.js.map