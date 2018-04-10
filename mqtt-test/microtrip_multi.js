var mqtt = require('mqtt');
const HOST = "localhost";
//const HOST = "223.39.118.163";
const SENSOR_ID = "d61a2890-8871-11e7-a7e5-9bf0541b4e27";
const ACCESS_TOKEN = "11112222333344445555";

const MSG =
{
    "ty": 2,
    "pld": [
        {
            "tid": 5,
            "fc": 40,
            "lat": 50075482,
            "lon": 14430068,
            "lc": 5,
            "clt": 1500451579993,
            "cdit": 353,
            "rpm": 3450,
            "sp": 70,
            "em": 28,
            "el": 20,
            "xyz": "2,3,5",
            "vv": 12.5,
            "tpos": 90
        },
        {
            "tid": 5,
            "fc": 30,
            "lat": 50075482,
            "lon": 14430068,
            "lc": 5,
            "clt": 1500451589993,
            "cdit": 353,
            "rpm": 3450,
            "sp": 70,
            "em": 28,
            "el": 20,
            "xyz": "2,3,5",
            "vv": 12.5,
            "tpos": 90
        },
        {
            "tid": 5,
            "fc": 20,
            "lat": 50075482,
            "lon": 14430068,
            "lc": 5,
            "clt": 1500451599993,
            "cdit": 353,
            "rpm": 3450,
            "sp": 70,
            "em": 28,
            "el": 20,
            "xyz": "2,3,5",
            "vv": 12.5,
            "tpos": 90
        },
    ]
};

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST, { username: ACCESS_TOKEN});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('trying to publish microtrip!');
    client.publish('v1/sensors/me/tre', JSON.stringify(MSG), {qos: 1});
    console.log('published!');

    client.end();
});

client.on('message',function(topic, message){
    console.log(topic + " " +message.toString());
});