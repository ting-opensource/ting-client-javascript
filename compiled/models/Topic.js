System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Topic;
    return {
        setters:[],
        execute: function() {
            Topic = (function () {
                function Topic() {
                    this.topicId = '';
                    this.name = '';
                    this.isActive = false;
                    this.createdBy = '';
                    this.createdAt = null;
                    this.updatedBy = '';
                    this.updatedAt = null;
                }
                return Topic;
            }());
            exports_1("Topic", Topic);
        }
    }
});
//# sourceMappingURL=Topic.js.map