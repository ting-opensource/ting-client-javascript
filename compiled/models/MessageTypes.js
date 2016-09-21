(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var MessageTypes = (function () {
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
    exports.MessageTypes = MessageTypes;
});
//# sourceMappingURL=MessageTypes.js.map