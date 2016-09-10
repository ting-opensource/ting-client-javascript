System.import('compiled:TingClient')
.then(function({TingClient})
{
    let client = new TingClient('http://localhost:9999', 'TEST_SUBSCRIBER');

    client.connect()
    .then(function(socketId)
    {
        console.info('Connect wih Socket Id: ', socketId);
    })
    .catch(function(error)
    {
        console.error('Connection Failed');
        console.error(error);
    });
});
