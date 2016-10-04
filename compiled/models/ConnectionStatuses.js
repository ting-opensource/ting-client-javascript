(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ConnectionStatuses = (function () {
        function ConnectionStatuses() {
        }
        Object.defineProperty(ConnectionStatuses, "CONNECTING", {
            get: function () {
                return 'CONENCTING';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "CONNECTED", {
            get: function () {
                return 'CONNECTED';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "DISCONNECTED", {
            get: function () {
                return 'DISCONNECTED';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionStatuses, "ERRORED", {
            get: function () {
                return 'ERRORED';
            },
            enumerable: true,
            configurable: true
        });
        return ConnectionStatuses;
    }());
    exports.ConnectionStatuses = ConnectionStatuses;
});
//# sourceMappingURL=ConnectionStatuses.js.map