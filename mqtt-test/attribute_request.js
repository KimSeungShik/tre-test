var mqtt = require('mqtt');
const HOST = "localhost";
const ACCESS_TOKEN = "11112222333344445555";

//const MSG = {
//                    "attr1":"xxx",
//                    "attr2":"yyy",
//                    "attr3":100
//                  };

const MSG = {
    "clientKeys":"attr1,attr3",
//    "sharedKeys":"attr2"
};

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN
});

client.on('connect', function () {
    console.log('connected')

    client.subscribe('v1/sensors/me/attributes/response/+')
    client.publish('v1/sensors/me/attributes/request/1',JSON.stringify(MSG), {qos: 1})
});

client.on('message', function (topic, message) {
    console.log('response.topic: ' + topic)
    console.log('response.body: ' + message.toString())
    client.end()
});