export class Base64Encoder
{
    static encode(data: string): string
    {
        return window.btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, function(match, pattern)
        {
            return String.fromCharCode(parseInt('0x' + pattern));
        }));
    }
}
