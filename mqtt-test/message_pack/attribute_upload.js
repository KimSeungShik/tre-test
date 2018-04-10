var mqtt = require('mqtt');
var msgpack = require("msgpack-lite");

const HOST = "localhost";
const ACCESS_TOKEN = "11112222333344445555";

const MSG = {
                    "attr4":"xxxx",
                    "attr5":"uuuu",
                    "attr6":30
                  };

const CONVERTED_MSG = msgpack.encode(MSG);

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN
});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('before converting');
    console.log(MSG);
    console.log('after converting');
    console.log(CONVERTED_MSG);

    console.log('after decoding');
//    console.log(msgpack.decode(new Buffer(CONVERTED_MSG,'hex')));
    console.log(msgpack.decode(CONVERTED_MSG));

    client.publish('v1/sensors/me/mp/attributes', CONVERTED_MSG, {qos: 1});
    console.log('published!');

    client.end();
});
