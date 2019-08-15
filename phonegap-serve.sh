#!/usr/bin/env bash


nohup phonegap serve --host="0.0.0.0" --port=9004 > ./serve-$(date +%Y-%m-%d-%H%M).log 2>&1

