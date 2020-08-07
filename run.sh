#!/usr/bin/env bash


PROJECT_HOME=/mnt/data/code

echo "PROJECT_HOME:  ${PROJECT_HOME}"

${PROJECT_HOME}/algernon/algernon  --dev --conf /mnt/data/code/algernon/serverconf.lua --dir ${PROJECT_HOME}/mobile-booru/www  --httponly --debug  --server 0.0.0.0:9004

