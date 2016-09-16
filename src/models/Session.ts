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

    _token:string = '';
    get token():string
    {
        return this._token;
    }

    constructor(serviceBaseURL:string, userId:string)
    {
        this._serviceBaseURL = serviceBaseURL;
        this._userId = userId;
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