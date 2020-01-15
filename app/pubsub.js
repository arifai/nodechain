const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-1f644b0b-e844-4180-93e0-29f8843b740e',
    subscribeKey: 'sub-c-b5897b98-3752-11ea-be28-ae0ede4a022d',
    secretKey: 'sec-c-ZDZmODI3OGYtYzg5My00MWM0LTljODktZWQzZTcwNzUxNmIw'
};

const CHANNELS = {
    TEST: 'DUMMY-TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });

        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}

const testPubSub = new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'Hello world!' });

module.exports = PubSub;