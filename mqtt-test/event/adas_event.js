var mqtt = require('mqtt');
const HOST = "localhost";

//staging
//const HOST = "smartfleet.sktelecom.com:9900";

//production
//const HOST = "smartfleet.sktelecom.com:8883";

const ACCESS_TOKEN = "11112222333344445556";

const MSG =
{
    "ty": 107,
    "pld": {
        "lon" : 127.114513,
        "lat" : 37.380241,
        "sp" : 113,
        "dir" : 31,
        "ldw" : 32,
        "fcw" : 30
    }
};

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

//var client  = mqtt.connect('mqtts://'+ HOST, { username: ACCESS_TOKEN});
var client  = mqtt.connect('mqtt://'+ HOST, { username: ACCESS_TOKEN});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('trying to publish adas event!');
    client.publish('v1/sensors/me/tre', JSON.stringify(MSG), {qos: 1});
    console.log('published!');

    client.end();
});

client.on('message',function(topic, message){
    console.log(topic + " " +message.toString());
});