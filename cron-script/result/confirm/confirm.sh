#!/bin/bash
cd ~sfmgr/TEST/cron-script/result 
tdate=`date +%Y%m%d%H%M`
find . -maxdepth 1 -type f -print | wc -l > ./confirm/confirm.$tdate
find . -maxdepth 1 -type f -print -exec tail -20 {} \; >> ./confirm/confirm.$tdate
