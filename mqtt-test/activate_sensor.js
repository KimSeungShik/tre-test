var mqtt = require('mqtt');
const HOST = "localhost";
const ACCESS_TOKEN = "11112222333344445555";

const RESULT_MSG = {
                  "result": "2000",
                  "addInfo":{
                    "vid": "11마1234"
                  }
                };

console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN
});

client.on('connect', function () {
    console.log('Client connected!');

    const requestId = "2ea392e0-83e9-11e7-88f0-73004c439167";
    const rpcResultTopic = "v1/sensors/me/rpc/result/" + requestId;

    client.publish(rpcResultTopic, JSON.stringify(RESULT_MSG),{qos:1},function(){
        console.log("published RPC result");
        client.end();
    });
});
