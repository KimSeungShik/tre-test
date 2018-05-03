var mqtt = require('mqtt');
var msgpack = require("msgpack-lite");

const GPS_MICROTRIP_TY = 2;
const OBD_MICROTRIP_TY = 4;
const ADAS_MICROTRIP_TY = 6;
const BLACKBOX_MICROTRIP_TY = 8;

const microTripCntPerTrip = 10;
const topic = "v1/sensors/me/tre";
const mpTopic = "v1/sensors/me/mp/tre";

function sendMsg (client, ty, tripId, cnt, callback){
  let msg = {
    "ty": ty,
  }

  switch(ty){
    case 1:
    msg.pld = {
      "tid": tripId,
      "stt": 1500451548993,
      "edt": 1500451550000,
      "dis": 3002,
      "stlat": 50075482,
      "stlon": 14430068,
      "edlat": 50085482,
      "edlon": 14432068,
      "hsts": 146,
      "mesp": 54,
      "fwv": "vonS41-1.11",
      "dtvt": 1240
    }
    break;
    case 2:
    msg.pld = {
      "tid": tripId,
      "lat": 50075482,
      "lon": 14430068,
      "alt": 5,
      "clt": 1500450539993,
      "sp": 70,
      "dop": 43358,
      "nos": 23523,
      "tdis": 9230
    }
    break;
    case 3:
    msg.pld = {
      "tid": tripId,
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
    break;
    case 4:
    msg.pld = {
      "tid": tripId,
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
    break;
    case 5:
    msg.pld = {
      "tid": tripId,
      "lat": 50075482,
      "lon": 14430068,
      "dop": 34690,
      "nos": 523
    }
    break;
    case 6:
    msg.pld = {
      "tid": tripId,
      "lat": 50075482,
      "lon": 14430068,
      "dop": 34690,
      "nos": 523,
      "dir": 0,
      "sp": 40,
      "ldw": 0,
      "rld": 93,
      "lld": 54,
      "fcw": 0,
      "hdw": 1,
      "brk": 0,
      "chcmr": 0,
      "chdir": 0,
      "chbrk": 0
    }
    break;
    case 7:
    msg.pld = {
      "tid": tripId,
      "lat": 50075482,
      "lon": 14430068,
      "try": 1,
      "vlt": 12
    }
    break;
    case 8:
    msg.pld = {
      "tid": tripId,
      "try": 1,
      "lat": 50075482,
      "lon": 14430068,
      "sp": 70,
      "vlt": 12,
      "tem": 23,
      "tim": 63
    }
    break;
  }

  if(cnt > microTripCntPerTrip){
    msg.ty = msg.ty -1;
    client.publish(topic, JSON.stringify(msg),{qos:1},function(){
      client.end();
      console.log("MQTT: sent trip type:",ty -1 );
      console.log("MQTT: connection closed");
      callback(null, msg.pld.tid);
    });
  } else {
    client.publish(topic, JSON.stringify(msg),{qos:1},function(){
      console.log("MQTT: sent microtrip type:" + ty + " cnt:",cnt);
      setTimeout(function(){
        sendMsg(client, ty, tripId, cnt + 1, callback);
      }, 1000);
    });
  }

}

function sendGPS (args, callback){
  const gpsClient = mqtt.connect({
    host: args.host,
    port: args.port,
    username: args.credentials.credentialsIdGPS,
    clean: true,
    keepalive: 60,
    rejectUnauthorized: true,
    protocol: args.protocol
  });

  gpsClient.on('connect', function () {
    console.log("MQTT: gpsClient connected");
    sendMsg(gpsClient, GPS_MICROTRIP_TY, args.tripId, 1, callback);
  });
}

function sendOBD (args, callback){
  const obdClient = mqtt.connect({
    host: args.host,
    port: args.port,
    username: args.credentials.credentialsIdOBD,
    clean: true,
    keepalive: 60,
    rejectUnauthorized: true,
    protocol: args.protocol
  });

  obdClient.on('connect', function () {
    console.log("MQTT: obdClient connected");
    sendMsg(obdClient, OBD_MICROTRIP_TY, args.tripId, 1, callback);
  });
}

function sendADAS (args, callback){
  const adasClient = mqtt.connect({
    host: args.host,
    port: args.port,
    username: args.credentials.credentialsIdADAS,
    clean: true,
    keepalive: 60,
    rejectUnauthorized: true,
    protocol: args.protocol
  });

  adasClient.on('connect', function () {
    console.log("MQTT: adasClient connected");
    sendMsg(adasClient, ADAS_MICROTRIP_TY, args.tripId, 1, callback);
  });
}

function sendBLACKBOX (args, callback){
  const blacboxClient = mqtt.connect({
    host: args.host,
    port: args.port,
    username: args.credentials.credentialsIdBLACKBOX,
    clean: true,
    keepalive: 60,
    rejectUnauthorized: true,
    protocol: args.protocol
  });

  blacboxClient.on('connect', function () {
    console.log("MQTT: blacboxClient connected");
    sendMsg(blacboxClient, BLACKBOX_MICROTRIP_TY, args.tripId, 1, callback);
  });
}

function sendMpObdMicrotrip(args, callback){
  const obdClient = mqtt.connect({
    host: args.host,
    port: args.port,
    username: args.credentials.credentialsIdOBD,
    clean: true,
    keepalive: 60,
    rejectUnauthorized: true,
    protocol: args.protocol
  });

  obdClient.on('connect', function () {
    console.log("MQTT: obdClient connected");

    const MSG =
    {
        "ty": 4,
        "pld": [
            {
                "tid": args.tripId,
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
                "tid": args.tripId,
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
                "tid": args.tripId,
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

    // console.log('before converting');
    // console.log(MSG);
    // console.log('after converting');
    const CONVERTED_MSG = msgpack.encode(MSG);
    // console.log('after decoding');
    // console.log(msgpack.decode(CONVERTED_MSG));

    obdClient.publish(mpTopic, CONVERTED_MSG,{qos:1},function(){
      obdClient.end();
      console.log("MQTT: sent messagepack multi microtrip");
      console.log("MQTT: connection closed");
      callback(null, {});
    });

  });
}

module.exports = {
  sendGPS,
  sendOBD,
  sendADAS,
  sendBLACKBOX,
  sendMpObdMicrotrip
}

// sendGPS({
//   "mqttHost": "localhost",
//   "mqttPort": 1883,
//   "mqttProtocol": "mqtt"
// }, null);
