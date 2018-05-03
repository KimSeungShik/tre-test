const newman = require('newman');
const moment = require('moment');
const async = require('async');
const fs = require('fs');
const sendTrip = require('./sendTrip');

const testFilePrefix = 'TEST-V1_1-DeviceType';

if(process.argv.length !== 3) {
    console.log("[Usage] node [testFileName.js] [envFileName.json]");
    console.log("[Example] node ./" + testFilePrefix + ".js env.dev.json");
    process.exit(1);
}

let defaultEnv = process.argv[2];
if(!defaultEnv.startsWith('./')) defaultEnv = './' + defaultEnv;
const config = JSON.parse(fs.readFileSync(defaultEnv,'utf8'));

let step = 0;

const defaultNewmanOptions = {
    collection: require('../postman/' + testFilePrefix + '.json'),
    delayRequest: 100,
//    reporters: ['cli','html'],
    reporters: ['cli']
}

function makeNewmanOption(env, folder){
    step++;

    const options = Object.assign({},defaultNewmanOptions);
    if(env == null) {
        options.environment = {
            "id": "09d8e204-ac83-8de2-809d-6c5b85c828c3",
              "name": "dynamic",
              "values": [
                {
                  "enabled": true,
                  "key": "url",
                  "value": config.url,
                  "type": "text"
                }
              ],
              "timestamp": 1519181955430,
              "_postman_variable_scope": "environment",
              "_postman_exported_at": "2018-02-22T06:50:33.850Z",
              "_postman_exported_using": "Postman/5.5.3"
        }
    } else {
        options.environment = env;
    }

    options.folder = folder;
//    options.reporter = {
//                           html:{
//                               export:'result/' + defaultEnv + '/' + testFilePrefix + '_' + moment().format('YYYYMMDD_HHmmss') + '_step_' + step + '.html'
//                           }
//                       }

    return options;
}

function step1_setup(callback){
    const options = makeNewmanOption(null, 'Setup');

    newman.run(options,function(err,output){
      callback(null,{environment:output.environment});
    });
}

function step2_prepareDirectorTrip(args, callback){
    const options = makeNewmanOption(args.environment, 'Prepare Director Trip');

    newman.run(options,function(err,output){
      // console.log("---output4", output.environment.values.reference.credentialsIdGPS.value);
      const environment = output.environment.values.reference;
      var credentials = {
        credentialsIdGPS: environment.credentialsIdGPS.value,
        credentialsIdOBD: environment.credentialsIdOBD.value,
        credentialsIdADAS: environment.credentialsIdADAS.value,
        credentialsIdBLACKBOX: environment.credentialsIdBLACKBOX.value,
      }

      callback(null,{environment:output.environment, credentials:credentials});
    });
}

function sendTrips(args, callback){
    step++;

    const mqttArg = {
        host: config.mqttHost,
        port: config.mqttPort,
        protocol: config.mqttProtocol,
        credentials: args.credentials
    }

    async.parallel({
        sendGPS: function(innerCallback) {
          let arg = Object.assign({}, mqttArg);
          arg.tripId = Math.floor(Math.random() * 100 + 1);
          sendTrip.sendGPS(arg, innerCallback);
        },
        sendOBD: function(innerCallback) {
          let arg = Object.assign({}, mqttArg);
          arg.tripId = Math.floor(Math.random() * 100 + 1);
          sendTrip.sendOBD(arg, innerCallback);
        },
        sendADAS: function(innerCallback) {
          let arg = Object.assign({}, mqttArg);
          arg.tripId = Math.floor(Math.random() * 100 + 1);
          sendTrip.sendADAS(arg, innerCallback);
        },
        sendBLACKBOX: function(innerCallback) {
          let arg = Object.assign({}, mqttArg);
          arg.tripId = Math.floor(Math.random() * 100 + 1);
          sendTrip.sendBLACKBOX(arg, innerCallback);
        }
    }, function(err, results) {
        if(err != null){
            callback('send Trip error',{environment:args.environment});
        } else {
          let env = args.environment;
          // env.values.push({
          //   "enabled": true,
          //   "key": "gpsDeviceTripId",
          //   "value": results['sendGPS'],
          //   "type": "integer"
          // });
          // env.values.push({
          //   "enabled": true,
          //   "key": "obdDeviceTripId",
          //   "value": results['sendOBD'],
          //   "type": "integer"
          // });
          // env.values.push({
          //   "enabled": true,
          //   "key": "adasDeviceTripId",
          //   "value": results['sendADAS'],
          //   "type": "integer"
          // });
          // env.values.push({
          //   "enabled": true,
          //   "key": "blackboxDeviceTripId",
          //   "value": results['sendBLACKBOX'],
          //   "type": "integer"
          // });

          callback(null, {environment:env});
        }
    });
}

function step4_checkDirectorTrip(args, callback){
    const options = makeNewmanOption(args.environment, 'Check Director Trip');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step5_prepareDriverTrip(args, callback){
    const options = makeNewmanOption(args.environment, 'Prepare Driver Trip');

    newman.run(options,function(err,output){
      const environment = output.environment.values.reference;
      var credentials = {
        credentialsIdGPS: environment.credentialsIdGPS.value,
        credentialsIdOBD: environment.credentialsIdOBD.value,
        credentialsIdADAS: environment.credentialsIdADAS.value,
        credentialsIdBLACKBOX: environment.credentialsIdBLACKBOX.value,
      }
      callback(null,{environment:output.environment, credentials:credentials});
    });
}

function step7_checkDriverTrip(args, callback){
    const options = makeNewmanOption(args.environment, 'Check Driver Trip');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step8_checkVehicleTrip(args, callback){
    const options = makeNewmanOption(args.environment, 'Check Vehicle Trip');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step9_cleanup(args, callback){
    const options = makeNewmanOption(args.environment, 'Cleanup');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

async.waterfall([
    step1_setup,
    step2_prepareDirectorTrip,
    sendTrips,
    step4_checkDirectorTrip,
    step5_prepareDriverTrip,
    sendTrips,
    step7_checkDriverTrip,
    step8_checkVehicleTrip,
    step9_cleanup
],
function(err, results) {
    console.log("All tests finished");
});
