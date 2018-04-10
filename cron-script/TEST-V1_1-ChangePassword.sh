#!/bin/bash
cd ~sfmgr/TEST/newman
tdate=`date +%Y%m%d%H%M`
filename='TEST-V1_1-ChangePassword'
node ./$filename.js ./env.production.json > ../cron-script/result/$filename.$tdate

