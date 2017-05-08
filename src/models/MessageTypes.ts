export class MessageTypes
{
    static get TEXT(): string
    {
        return 'text/plain';
    }

    static get HTML(): string
    {
        return 'text/html';
    }

    static get JSON(): string
    {
        return 'application/json';
    }

    static get FILE(): string
    {
        return 'application/octet-stream';
    }
}