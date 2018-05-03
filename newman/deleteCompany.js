const fs = require('fs');
var request = require("request");
var rp = require("request-promise-native");

if(process.argv.length !== 4) {
    console.log("[Usage] node deleteCompany.js [companyId] [envFileName.json]");
    process.exit(1);
}

const companyId = process.argv[2];

let defaultEnv = process.argv[3];
if(!defaultEnv.startsWith('./')) defaultEnv = './' + defaultEnv;
const config = JSON.parse(fs.readFileSync(defaultEnv,'utf8'));

var login_config = {
	'timeout' : 5000,
	'json' : true,
	'headers' : {
		'Content-Type': 'application/json'
	},
	'body' : {"username":"sysadmin@thingsboard.org","password":"sysadmin"},
};

// auth
const loginOption = {
    timeout: 5000,
    json: true,
    headers:{
        'Content-Type': 'application/json'
    },
    body:{
        username: 'admin@smartfleet.sktelecom.com',
        password: 'smart2017.123$'
    },
    url: config.url + '/api/auth/login',
    rejectUnauthorized:false
}

rp.post(loginOption)
    .then( (body) => {

        deleteOption = {
            timeout: 5000,
            url: config.url + '/api/tre/v1/company/' + companyId,
            headers:{
                'Content-Type': 'application/json',
                'X-Authorization' : 'Bearer ' + body.token
            },
            rejectUnauthorized:false
        }

        request.delete( deleteOption, (err, response, body) => {
            if ( err) {
                console.error( 'HTTP Failed', err);
            }
            else if ( response.statusCode !== 200) {
                console.error( 'HTTP bad response', response.statusCode);
            }
            else {
                console.log( 'HTTP success:', companyId);
            }
        });
    })
    .catch( (err) => {
        console.error( 'Auth failed', err);
    });