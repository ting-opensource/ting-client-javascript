System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TingEvents;
    return {
        setters:[],
        execute: function() {
            TingEvents = (function () {
                function TingEvents() {
                }
                Object.defineProperty(TingEvents, "SUBSCRIPTION_LIVE", {
                    get: function () {
                        return 'subscription-live';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TingEvents, "SUBSCRIPTION_OFF", {
                    get: function () {
                        return 'subscription-off';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TingEvents, "MESSAGE", {
                    get: function () {
                        return 'message';
                    },
                    enumerable: true,
                    configurable: true
                });
                return TingEvents;
            }());
            exports_1("TingEvents", TingEvents);
        }
    }
});
//# sourceMappingURL=TingEvents.js.map