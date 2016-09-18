export class Session
{
    private _serviceBaseURL:string = '';
    get serviceBaseURL():string
    {
        return this._serviceBaseURL;
    }

    private _userId:string = '';
    get userId():string
    {
        return this._userId;
    }

    private _clientId:string = '';
    get clientId():string
    {
        return this._clientId;
    }

    private _clientSecret:string = '';
    get clientSecret():string
    {
        return this._clientSecret;
    }

    _token:string = '';
    get token():string
    {
        return this._token;
    }

    constructor(serviceBaseURL:string, userId:string, clientId:string, clientSecret:string)
    {
        this._serviceBaseURL = serviceBaseURL;
        this._userId = userId;
        this._clientId = clientId;
        this._clientSecret = clientSecret;
    }

    getClientAuthorizationToken():string
    {

    }

    isAuthenticated():boolean
    {
        return this._token ? true : false;
    }

    autheticateWithToken(token:string):void
    {
        this._token = token;
    }
}