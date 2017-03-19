(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Base64Encoder = (function () {
        function Base64Encoder() {
        }
        Base64Encoder.encode = function (data) {
            return window.btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function (match, pattern) {
                return String.fromCharCode(parseInt('0x' + pattern));
            }));
        };
        return Base64Encoder;
    }());
    exports.Base64Encoder = Base64Encoder;
});
//# sourceMappingURL=Base64Encoder.js.map