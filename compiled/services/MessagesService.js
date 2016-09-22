(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'whatwg-fetch', 'lodash', '../adapters/MessageAdapter'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var _ = require('lodash');
    var MessageAdapter_1 = require('../adapters/MessageAdapter');
    var DEFAULT_PAGE_SIZE = 100;
    var MessagesService = (function () {
        function MessagesService() {
        }
        MessagesService.fetchMessagesForTopicSinceMessage = function (session, topic, message) {
            var url = session.serviceBaseURL + "/messages?topic=" + encodeURIComponent(topic.name) + "&sinceMessageId=" + encodeURIComponent(message.messageId) + "&pageSize=" + encodeURIComponent(DEFAULT_PAGE_SIZE.toString());
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
            var url = session.serviceBaseURL + "/messages?topic=" + encodeURIComponent(topic.name) + "&tillMessageId=" + encodeURIComponent(message.messageId) + "&pageSize=" + encodeURIComponent(DEFAULT_PAGE_SIZE.toString());
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