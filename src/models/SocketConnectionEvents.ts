export class SocketConnectionEvents
{
    static get CONNECT():string
    {
        return 'connect';
    }

    static get ERROR():string
    {
        return 'error';
    }

    static get DISCONNECT():string
    {
        return 'disconnect';
    }

    static get RECONNECT_ATTEMPT():string
    {
        return 'reconnect_attempt';
    }

    static get RECONNECTING():string
    {
        return 'reconnecting';
    }

    static get RECONNECT():string
    {
        return 'reconnect';
    }

    static get RECONNECT_ERROR():string
    {
        return 'reconnect_error';
    }

    static get RECONNECT_FAILED():string
    {
        return 'reconnect_failed';
    }
}