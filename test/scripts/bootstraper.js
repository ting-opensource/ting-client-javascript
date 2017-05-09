Promise.all([
    System.import('jquery'),
    System.import('compiled:/TingClient')
])
.then(function(args)
{
    let $ = args[0];
    let TingClient = args[1].TingClient;

    let client = new TingClient('http://localhost:6013',
                                'TEST_SUBSCRIBER',
                                '__TING_CLIENT_ID_FOR_DEV__',
                                '__TING_CLIENT_SECRET_FOR_DEV__');
    window.client = client;


    let selectedFile = null;
    $('#file').on('change', (event) =>
    {
        selectedFile = $(event.target).get(0).files[0];
    });

    $('#submit').on('click', (event) =>
    {
        event.preventDefault();
        console.log(selectedFile);
        client.publishFile('test-topic', selectedFile);
    });

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

    client.connectionStatus.subscribe(function(connectionStatus)
    {
        console.log('Connection Status: ', connectionStatus);
    });

    client.isConnected.subscribe(function(isConnected)
    {
        if(isConnected)
        {
            console.info('Client is Connected');
        }
        else
        {
            console.warn('Client is NOT Connected');
        }
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

        client.getMessageStreamForTopicName('other-test-topic').subscribe((messages) =>
        {
            console.warn('messages updated on other-test-topic');
            console.warn(messages);
        });

        setTimeout(function()
        {
            let testTopic = client.getSubscribedTopicByName('test-topic');
            let messages = client.getMessageStreamForTopic(testTopic).getValue();
            client.fetchMessagesForTopicSinceMessage(testTopic, messages[messages.length - 1]);

            testTopic.unreadMessagesCount.subscribe((unreadMessagesCount) =>
            {
                console.warn('Unread messages count updated on test-topic to ', unreadMessagesCount);
            });

            client.publishMessage('test-topic', 'test-message', 'text/plain')
            .then((updatedMessage) =>
            {
                client.markAMessageAsRead(updatedMessage);
            });
        }, 3000);
    })
    .catch(function(error)
    {
        console.error('Connection Failed');
        console.error(error);
    });
});
