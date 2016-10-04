export class ConnectionStatuses
{
    static get CONNECTING():string
    {
        return 'CONENCTING';
    }

    static get CONNECTED():string
    {
        return 'CONNECTED';
    }

    static get DISCONNECTED():string
    {
        return 'DISCONNECTED';
    }

    static get ERRORED():string
    {
        return 'ERRORED';
    }
}