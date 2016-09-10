System.import('compiled:TingClient')
.then(function({TingClient})
{
    let client = new TingClient('http://localhost:9999', 'TEST_SUBSCRIBER');

    client.connect()
    .then(function(socket)
    {
        console.info('Connect wih Socket: ', socket);

        client.getMessageStreamForTopicName('test-topic').subscribe((message) =>
        {
            console.info(message);
        });

        client.getMessageStreamForTopicName('other-test-topic').subscribe((message) =>
        {
            console.warn(message);
        });
    })
    .catch(function(error)
    {
        console.error('Connection Failed');
        console.error(error);
    });
});
