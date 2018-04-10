var mqtt = require('mqtt');
var msgpack = require("msgpack-lite");

const HOST = "localhost";

//staging
//const HOST = "smartfleet.sktelecom.com:9900";

//production
//const HOST = "smartfleet.sktelecom.com:8883";

const ACCESS_TOKEN = "11112222333344445555";
//ACCESS_TOKEN = "ANGEL12345BABY123456";

const MSG =
{
    "ty": 101,
    "pld": {
        "dtcc": "aaa",
        "dtck": 0,
        "dtcs": 1
    }
};

const CONVERTED_MSG = msgpack.encode(MSG);

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

//var client  = mqtt.connect('mqtts://'+ HOST, { username: ACCESS_TOKEN});
var client  = mqtt.connect('mqtt://'+ HOST, { username: ACCESS_TOKEN});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('before converting');
    console.log(MSG);
    console.log('after converting');
    console.log(CONVERTED_MSG);

    console.log('after decoding');
//    console.log(msgpack.decode(new Buffer(CONVERTED_MSG,'hex')));
    console.log(msgpack.decode(CONVERTED_MSG));

    client.publish('v1/sensors/me/mp/tre', CONVERTED_MSG, {qos: 1});
    console.log('published!');

    client.end();
});

client.on('message',function(topic, message){
    console.log(topic + " " +message.toString());
});