(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'whatwg-fetch'], factory);
    }
})(function (require, exports) {
    "use strict";
    require('whatwg-fetch');
    var AuthenticationService = (function () {
        function AuthenticationService() {
        }
        AuthenticationService.authenticateSession = function (session) {
            return fetch(session.serviceBaseURL + "/authorize", {
                method: 'POST',
                body: JSON.stringify({
                    userId: session.userId
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else {
                    var error = new Error(response.statusText);
                    throw error;
                }
            })
                .then(function (response) {
                session.autheticateWithToken(response.token);
                return session;
            });
        };
        return AuthenticationService;
    }());
    exports.AuthenticationService = AuthenticationService;
});
//# sourceMappingURL=AuthenticationService.js.map