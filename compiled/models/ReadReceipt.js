(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ReadReceipt = (function () {
        function ReadReceipt(data) {
            this.messageId = '';
            this.subscriber = '';
            this.readOn = null;
            for (var key in data) {
                this[key] = data[key];
            }
        }
        return ReadReceipt;
    }());
    exports.ReadReceipt = ReadReceipt;
});
//# sourceMappingURL=ReadReceipt.js.map