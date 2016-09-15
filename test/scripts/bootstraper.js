System.import('compiled:TingClient')
.then(function({TingClient})
{
    let client = new TingClient('http://localhost:9999', 'TEST_SUBSCRIBER');

    client.on('subscription-live', function(subscription)
    {
        console.info('subscription-live');
        console.info(subscription);
    });

    client.on('subscription-off', function(subscription)
    {
        console.warn('subscription-off');
        console.warn(subscription);
    });

    client.on('message', function(message)
    {
        console.info('message');
        console.info(message);
    });

    client.on('message:test-topic', function(message)
    {
        console.info('message:test-topic');
        console.info(message);
    });

    client.on('message:other-test-topic', function(message)
    {
        console.info('message:other-test-topic');
        console.info(message);
    });

    client.connect()
    .then(function(socket)
    {
        console.info('Connect wih Socket: ', socket);

        client.getSubscribedTopics().subscribe((topics) =>
        {
            console.warn('topics updated');
            console.warn(topics);
        });

        client.getMessageStreamForTopicName('test-topic').subscribe((messages) =>
        {
            console.warn('messages updated on test-topic');
            console.warn(messages);
        });

        client.getMessageStreamForTopicName('other-test-topic').subscribe((messages) =>
        {
            console.warn('messages updated on other-test-topic');
            console.warn(messages);
        });
    })
    .catch(function(error)
    {
        console.error('Connection Failed');
        console.error(error);
    });
});
