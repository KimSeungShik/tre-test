var mqtt = require('mqtt');
const HOST = "localhost";
const ACCESS_TOKEN = "11112222333344445555";

const MSG = {
                    "attr4":"bbb",
                    "attr5":"ggg",
                    "attr6":100
                  };

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN
});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('trying to publish attributes!');
    client.publish('v1/sensors/me/attributes', JSON.stringify(MSG), {qos: 1});
    console.log('published!');

    client.end();
});
