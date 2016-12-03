(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var TingEvents = (function () {
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
        Object.defineProperty(TingEvents, "MESSAGE_READ", {
            get: function () {
                return 'message-read';
            },
            enumerable: true,
            configurable: true
        });
        return TingEvents;
    }());
    exports.TingEvents = TingEvents;
});
//# sourceMappingURL=TingEvents.js.map