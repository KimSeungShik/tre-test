const newman = require('newman');
const moment = require('moment');
const async = require('async');
const fs = require('fs');
const sendTrip = require('./sendTrip1');

const testFilePrefix = 'TEST-V1_0-MainTripRpc';

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

function step1_Setup(callback){
    const options = makeNewmanOption(null, '0. Setup');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step2_CreateJob(args, callback){
    const options = makeNewmanOption(args.environment, '1. Create Job');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step3_AssignAndAttachJob(args, callback){
    const options = makeNewmanOption(args.environment, '2. Assign and Attach Job');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function sendTrips(args, callback){
    step++;

    const mqttArg = {
        host: config.mqttHost,
        port: config.mqttPort,
        protocol: config.mqttProtocol
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

function step4_GetLastestTrip(args, callback){
    const options = makeNewmanOption(args.environment, '4. Get Lastest Trip');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step5_GetMicrotripUsingTripId(args, callback){
    const options = makeNewmanOption(args.environment, '5. Get Microtrip Using Trip ID');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}


function step6_RPC(args, callback){
    const options = makeNewmanOption(args.environment, '6. RPC');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step7_UnassignAndDetachJob(args, callback){
    const options = makeNewmanOption(args.environment, '7. Unassign and Detach Job');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step8_DeleteJob(args, callback){
    const options = makeNewmanOption(args.environment, '8. Delete Job');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step9_Cleanup(args, callback){
    const options = makeNewmanOption(args.environment, '9. Cleanup');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

async.waterfall([
    step1_Setup,
    step2_CreateJob,
    step3_AssignAndAttachJob,
    sendTrips,
    step4_GetLastestTrip,
	step5_GetMicrotripUsingTripId,
	//step6_RPC,
//	step7_UnassignAndDetachJob,
 //   step8_DeleteJob,
  //  step9_Cleanup
],
function(err, results) {
    console.log("All tests finished");
});
