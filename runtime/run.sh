#!/bin/sh
set -e

env

echo "Starting nodejs"

cd /app

COMMAND="${COMMAND:-npm run start}"

echo "Using command : " $COMMAND

exec $COMMAND