var mqtt = require('mqtt');
const HOST = "localhost";

//staging
//const HOST = "smartfleet.sktelecom.com:9900";

//production
//const HOST = "smartfleet.sktelecom.com:8883";

const SENSOR_ID = "d61a2890-8871-11e7-a7e5-9bf0541b4e27";
const ACCESS_TOKEN = "11112222333344445555";
//ACCESS_TOKEN = "ANGEL12345BABY123456";

const MSG =
{
    "ty": 4,
    "pld": {
        "tid": 15,
        "fc": 50,
        "lat": 50075482,
        "lon": 14430068,
        "lc": 5,
        "clt": 1500450539993,
        "cdit": 353,
        "rpm": 3450,
        "sp": 70,
        "em": 28,
        "el": 20,
        "xyz": "2,3,5",
        "vv": 12.5,
        "tpos": 90
    }
};

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

//var client  = mqtt.connect('mqtts://'+ HOST, { username: ACCESS_TOKEN});
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