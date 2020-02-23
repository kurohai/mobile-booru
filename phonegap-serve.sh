#!/usr/bin/env bash


nohup node ./node_modules/phonegap/bin/phonegap.js serve --host="0.0.0.0" --port=9004 2>&1 3>&1  > ./log/serve-$(date +%Y-%m-%d-%H%M).log &

