System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MessageTypes;
    return {
        setters:[],
        execute: function() {
            MessageTypes = (function () {
                function MessageTypes() {
                }
                Object.defineProperty(MessageTypes, "TEXT", {
                    get: function () {
                        return 'text/plain';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MessageTypes, "HTML", {
                    get: function () {
                        return 'text/html';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MessageTypes, "JSON", {
                    get: function () {
                        return 'application/json';
                    },
                    enumerable: true,
                    configurable: true
                });
                return MessageTypes;
            }());
            exports_1("MessageTypes", MessageTypes);
        }
    }
});
//# sourceMappingURL=MessageTypes.js.map