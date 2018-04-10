#!/bin/bash
cd ~sfmgr/TEST/newman
tdate=`date +%Y%m%d%H%M`
filename='TEST-V1_0-MainTripRpc_local'
node ./$filename.js ./env.local.json > ../cron-script/result/$filename.$tdate
