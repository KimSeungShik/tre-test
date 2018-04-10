var mqtt = require('mqtt');
const HOST = "localhost";
//const HOST = "smartfleet.sktelecom.com";

//staging
//const HOST = "smartfleet.sktelecom.com:9900";

//production
//const HOST = "smartfleet.sktelecom.com:8883";

const SENSOR_ID = "d61a2890-8871-11e7-a7e5-9bf0541b4e27";
const ACCESS_TOKEN = "11112222333344445555";

const MSG = {
//    "sid": SENSOR_ID,
//    "ts": 1500451548993,
    "ty": 3,
    "pld": {
        "tid": 15,
        "stt": 1500451548993,
        "edt": 1500451550000,
        "dis": 3002,
        "tdis": 242124,
        "fc": 5000,
        "stlat": 50075482,
        "stlon": 14430068,
        "edlat": 50085482,
        "edlon": 14432068,
        "ctp": 65,
        "coe": 13235,
        "fct": 345,
        "hsts": 146,
        "mesp": 54,
        "idt": 64,
        "btv": 14.5,
        "gnv": 12.5,
        "wut": 47,
        "usm": "010-0000-0000",
        "est": 650,
        "fwv": "vonS41-1.11",
        "dtvt": 1240
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
