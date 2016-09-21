(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SocketConnectionEvents = (function () {
        function SocketConnectionEvents() {
        }
        Object.defineProperty(SocketConnectionEvents, "CONNECT", {
            get: function () {
                return 'connect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "ERROR", {
            get: function () {
                return 'error';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "DISCONNECT", {
            get: function () {
                return 'disconnect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_ATTEMPT", {
            get: function () {
                return 'reconnect_attempt';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECTING", {
            get: function () {
                return 'reconnecting';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT", {
            get: function () {
                return 'reconnect';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_ERROR", {
            get: function () {
                return 'reconnect_error';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SocketConnectionEvents, "RECONNECT_FAILED", {
            get: function () {
                return 'reconnect_failed';
            },
            enumerable: true,
            configurable: true
        });
        return SocketConnectionEvents;
    }());
    exports.SocketConnectionEvents = SocketConnectionEvents;
});
//# sourceMappingURL=SocketConnectionEvents.js.map