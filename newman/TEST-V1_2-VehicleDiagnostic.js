const newman = require('newman');
const moment = require('moment');
const async = require('async');
const fs = require('fs');
const sendEvent = require('./sendEvent');

const testFilePrefix = 'TEST-V1_2-VehicleDiagnostic';

if(process.argv.length !== 3) {
    console.log("[Usage] node [testFileName.js] [envFileName.json]");
    console.log("[Example] node ./" + testFilePrefix + ".js env.dev.json");
    process.exit(1);
}

let defaultEnv = process.argv[2];
if(!defaultEnv.startsWith('./')) defaultEnv = './' + defaultEnv;
const config = JSON.parse(fs.readFileSync(defaultEnv,'utf8'));

const defaultNewmanOptions = {
    collection: require('../postman/' + testFilePrefix + '.json'),
    delayRequest: 100,
    reporters: ['cli']
}

function makeNewmanOption(env, folder){
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

    return options;
}

function step1_setup(callback){
    const options = makeNewmanOption(null, 'Setup');

    newman.run(options,function(err,output){
      const environment = output.environment.values.reference;
      var credentials = {
        credentialsIdOBD: environment.credentialsIdOBD.value,
      }
      callback(null,{environment:output.environment, credentials:credentials});
    });
}

function step2_sendEvents(args, callback){
    const mqttArg = {
        host: config.mqttHost,
        port: config.mqttPort,
        protocol: config.mqttProtocol,
        credentials: args.credentials
    }

    async.series({
        sendDiagnostic: function(innerCallback) {
          sendEvent.sendDiagnostic(mqttArg, innerCallback);
        },
        sendMultipleDiagnostic: function(innerCallback) {
          sendEvent.sendMultipleDiagnostic(mqttArg, innerCallback);
        }
    }, function(err, results) {
        if(err != null){
            callback('send Event error',{environment:args.environment});
        } else {
          let env = args.environment;

          callback(null, {environment:env});
        }
    });
}

function step3_checkEvents(args, callback){
    const options = makeNewmanOption(args.environment, 'Check Vehicle Diagnostics');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

function step4_cleanup(args, callback){
    const options = makeNewmanOption(args.environment, 'Cleanup');

    newman.run(options,function(err,output){
        callback(null,{environment:output.environment});
    });
}

async.waterfall([
    step1_setup,
    step2_sendEvents,
    step3_checkEvents,
    step4_cleanup
],
function(err, results) {
    console.log("All tests finished");
});
