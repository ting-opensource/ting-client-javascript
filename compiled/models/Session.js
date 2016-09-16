System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Session;
    return {
        setters:[],
        execute: function() {
            Session = (function () {
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
            exports_1("Session", Session);
        }
    }
});
//# sourceMappingURL=Session.js.map