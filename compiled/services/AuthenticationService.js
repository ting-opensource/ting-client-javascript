System.register(['whatwg-fetch'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AuthenticationService;
    return {
        setters:[
            function (_1) {}],
        execute: function() {
            AuthenticationService = (function () {
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
            exports_1("AuthenticationService", AuthenticationService);
        }
    }
});
//# sourceMappingURL=AuthenticationService.js.map