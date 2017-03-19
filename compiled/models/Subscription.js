(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Subscription = (function () {
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
    exports.Subscription = Subscription;
});
//# sourceMappingURL=Subscription.js.map