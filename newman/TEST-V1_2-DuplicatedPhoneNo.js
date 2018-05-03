const newman = require('newman');
const fs = require('fs');

const testFilePrefix = 'TEST-V1_2-DuplicatedPhoneNo';

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
    reporters: ['cli'],
    environment: {
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
}

newman.run(defaultNewmanOptions,function(err,output){
  console.log("All test finished");
});
