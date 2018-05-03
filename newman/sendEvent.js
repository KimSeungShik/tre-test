var mqtt = require('mqtt');

const OBD_DIAGNOSTIC_TY = 101;
const OBD_COLLISION_WARNING_DRIVING_TY = 102;
const OBD_COLLISION_WARNING_PARKING_TY = 103;
const OBD_BATTERY_WARNING_TY = 104;
const OBD_UNPLUGGED_WARNING_TY = 105;
const OBD_TURNOFF_WARNING_TY = 106;
const ADAS_EVENT_TY = 107;

const OBD_MULTI_DIAGNOSTIC_TY = 201;

const topic = "v1/sensors/me/tre";

function sendMsg (client, ty, callback){
  let msg = {
    "ty": ty,
  }

  switch(ty){
    case 101:
    msg.pld = {
      "dtcc": "aaa",
      "dtck": 0,
      "dtcs": 1
    }
    break;
    case 201:
    msg.ty = 101;
    msg.pld = {
      "dtcc": "aaa,bbb,ccc",
      "dtck": 0,
      "dtcs": 3
    }
    break;
    case 102:
    msg.pld = {
      "dclat" : 37.380241,
      "dclon" : 127.114513
    }
    break;
    case 103:
    msg.pld = {
      "plat" : 37.380241,
      "plon" : 127.114513
    }
    break;
    case 104:
    msg.pld = {
      "wbv": 13
    }
    break;
    case 105:
    msg.pld = {
      "unpt": 1505433907995,
      "pt": 1505434907995
    }
    break;
    case 106:
    msg.pld = {
      "rs": "unexpected reason"
    }
    break;
    case 107:
    msg.pld = {
      "lon" : 127.114513,
      "lat" : 37.380241,
      "sp" : 113,
      "dir" : 31,
      "ldw" : 32,
      "fcw" : 30
    }
    break;
  }

  client.publish(topic, JSON.stringify(msg),{qos:1},function(){
    client.end();
    console.log("MQTT: sent event type:",ty);
    console.log("MQTT: connection closed");
    callback(null, {});
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
    sendMsg(adasClient, ADAS_EVENT_TY, callback);
  });
}

function sendBatteryWarning (args, callback){
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
    console.log("MQTT: obdClient for sendBatteryWarning connected");
    sendMsg(obdClient, OBD_BATTERY_WARNING_TY, callback);
  });
}

function sendCollisionWarningDriving (args, callback){
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
    console.log("MQTT: obdClient for sendCollisionWarningDriving connected");
    sendMsg(obdClient, OBD_COLLISION_WARNING_DRIVING_TY, callback);
  });
}

function sendCollisionWarningParking (args, callback){
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
    console.log("MQTT: obdClient for sendCollisionWarningParking connected");
    sendMsg(obdClient, OBD_COLLISION_WARNING_PARKING_TY, callback);
  });
}

function sendDiagnostic (args, callback){
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
    console.log("MQTT: obdClient for sendDiagnostic connected");
    sendMsg(obdClient, OBD_DIAGNOSTIC_TY, callback);
  });
}

function sendMultipleDiagnostic (args, callback){
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
    console.log("MQTT: obdClient for sendDiagnostic connected");
    sendMsg(obdClient, OBD_MULTI_DIAGNOSTIC_TY, callback);
  });
}

function sendTrunoffWarning (args, callback){
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
    console.log("MQTT: obdClient for sendTrunoffWarning connected");
    sendMsg(obdClient, OBD_TURNOFF_WARNING_TY, callback);
  });
}

function sendUnpluggedWarning (args, callback){
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
    console.log("MQTT: obdClient for sendUnpluggedWarning connected");
    sendMsg(obdClient, OBD_UNPLUGGED_WARNING_TY, callback);
  });
}

module.exports = {
  sendADAS,
  sendBatteryWarning,
  sendCollisionWarningDriving,
  sendCollisionWarningParking,
  sendDiagnostic,
  sendMultipleDiagnostic,
  sendTrunoffWarning,
  sendUnpluggedWarning
}
