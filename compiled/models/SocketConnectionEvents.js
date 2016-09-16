System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SocketConnectionEvents;
    return {
        setters:[],
        execute: function() {
            SocketConnectionEvents = (function () {
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
            exports_1("SocketConnectionEvents", SocketConnectionEvents);
        }
    }
});
//# sourceMappingURL=SocketConnectionEvents.js.map