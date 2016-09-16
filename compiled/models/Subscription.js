System.register([], function(exports_1, context_1) {
    'use strict';
    var __moduleName = context_1 && context_1.id;
    var Subscription;
    return {
        setters:[],
        execute: function() {
            Subscription = (function () {
                function Subscription(data) {
                    this.subscriptionId = '';
                    this.topic = null;
                    this.subscriber = '';
                    this.isDurable = false;
                    this.isActive = false;
                    this.createdAt = null;
                    this.updatedAt = null;
                    for (var key in data) {
                        this[key] = data[key];
                    }
                }
                return Subscription;
            }());
            exports_1("Subscription", Subscription);
        }
    }
});
//# sourceMappingURL=Subscription.js.map