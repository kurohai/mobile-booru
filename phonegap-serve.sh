#!/bin/bash

WORKING_DIR=`realpath $(dirname $0)`
echo "Working dir: ${WORKING_DIR}"
cd "${WORKING_DIR}"
echo "pwd: ${PWD}"

# ls -halF ./node_modules/phonegap/bin/phonegap.js

# OLD STUFF
# Not working with systemd
# su - eburt -c `/usr/bin/node /mnt/data/code/mobile-booru/node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004 2>&1 3>&1  > /mnt/data/code/mobile-booru/log/serve-$(date +%Y-%m-%d-%H%M).log`
# /usr/bin/node /mnt/data/code/mobile-booru/node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004 2>&1 3>&1  > /mnt/data/code/mobile-booru/log/serve-$(date +%Y-%m-%d-%H%M).log
# /usr/bin/node /mnt/data/code/mobile-booru/node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004 
# /usr/bin/node /mnt/data/code/mobile-booru/node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004 2>&1 3>&1  > ./log/serve-$(date +%Y-%m-%d-%H%M).log &


# last working 2020-04-22
# /usr/bin/node ./node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004


# new npx
nohup /usr/bin/node /home/linuxbrew/.linuxbrew/bin/npx phonegap serve --host="0.0.0.0" --port=9004 ./log/serve-$(date +%Y-%m-%d-%H%M).log &

