var mqtt = require('mqtt');
var args = require('args-parser')(process.argv);

console.log('args:', args);

const HOST = args.host? args.host: "localhost";
//const HOST = "smartfleet.sktelecom.com";

const ACCESS_TOKEN = args.accessToken? args.accessToken: "asdf1231231231231231";

const ACK_MSG = {
                    "result":"ok",
                    "a":{
                        "a1":"b1",
                        "c1":3
                    }
                  };

//const RESULT_MSG = {
 //                 "aa":"bb",
  //                "cc":{
   //                 "dd":"ee",
    //                "ff":{"gg":"xx"}
     //             }
      //          };

const RESULT_CODE = args.resultCode? args.resultCode: 2000;

const RESULT_MSG = { "result" : RESULT_CODE }


console.log('Connecting to: %s using access token: %s', HOST, ACCESS_TOKEN);

var client  = mqtt.connect('mqtt://'+ HOST,{
    username: ACCESS_TOKEN,
    clientId: 'trf' + Math.random().toString(16).substr(2, 8),
    clean:true,
    keepalive:60,
    reconnectPeriod:1000
});

client.on('connect', function () {
    console.log('Client connected!');

    console.log('trying to subscribe rpc!');

    client.subscribe('v1/sensors/me/rpc/request/+', {qos: 1},function(){
        console.log('subscribed!');
    });
//    client.end();
});

client.on('message',function(topic, message){
    console.log(topic + " " +message.toString());

    if(topic.startsWith("v1/sensors/me/rpc/request/")){

        const requestId = topic.toString().split('/')[5];
            const rpcAckTopic = "v1/sensors/me/rpc/response/" + requestId;
            const rpcResultTopic = "v1/sensors/me/rpc/result/" + requestId;

            client.publish(rpcAckTopic, JSON.stringify(ACK_MSG),{qos:1},function(){
                console.log("published response ack");
                setTimeout(function(){
                    client.publish(rpcResultTopic, JSON.stringify(RESULT_MSG), {qos: 1},function(){
                        console.log("published result");
                    });
                }, 3000);
            });
    }

});
