var mqtt = require('mqtt');
const HOST = "localhost";
//const HOST = "smartfleet.sktelecom.com";

//staging
//const HOST = "smartfleet.sktelecom.com:9900";

//production
//const HOST = "smartfleet.sktelecom.com:8883";

const SENSOR_ID = "d61a2890-8871-11e7-a7e5-9bf0541b4e27";
const ACCESS_TOKEN = "11112222333344445558";

const MSG = {
//    "sid": SENSOR_ID,
//    "ts": 1500451548993,
    "ty" : 7,
    "pld" : {
        "tid" : 111123,
        "lon" : 127.114513,
        "lat" : 37.380241,
        "try" : 1,
        "vlt" : 12.1
    }
};

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

//var client  = mqtt.connect('mqtts://'+ HOST,{
var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN
});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('trying to publish trip!');
    client.publish('v1/sensors/me/tre', JSON.stringify(MSG), {qos: 1});
    console.log('published!');

    client.end();
});
