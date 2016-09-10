System.register(['rxjs'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var rxjs_1;
    var BUFFER_SIZE, Topic;
    return {
        setters:[
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }],
        execute: function() {
            BUFFER_SIZE = 999;
            Topic = (function () {
                function Topic(data) {
                    this.topicId = '';
                    this.name = '';
                    this.isActive = false;
                    this.createdBy = '';
                    this.createdAt = null;
                    this.updatedBy = '';
                    this.updatedAt = null;
                    this.messages = new rxjs_1.ReplaySubject(BUFFER_SIZE);
                    for (var key in data) {
                        this[key] = data[key];
                    }
                }
                Topic.prototype.addMessage = function (message) {
                    this.messages.next(message);
                };
                return Topic;
            }());
            exports_1("Topic", Topic);
        }
    }
});
//# sourceMappingURL=Topic.js.map