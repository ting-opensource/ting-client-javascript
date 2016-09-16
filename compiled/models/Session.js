(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Session = (function () {
        function Session(serviceBaseURL, userId) {
            this._serviceBaseURL = '';
            this._userId = '';
            this._token = '';
            this._serviceBaseURL = serviceBaseURL;
            this._userId = userId;
        }
        Object.defineProperty(Session.prototype, "serviceBaseURL", {
            get: function () {
                return this._serviceBaseURL;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "userId", {
            get: function () {
                return this._userId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Session.prototype, "token", {
            get: function () {
                return this._token;
            },
            enumerable: true,
            configurable: true
        });
        Session.prototype.isAuthenticated = function () {
            return this._token ? true : false;
        };
        Session.prototype.autheticateWithToken = function (token) {
            this._token = token;
        };
        return Session;
    }());
    exports.Session = Session;
});
//# sourceMappingURL=Session.js.map