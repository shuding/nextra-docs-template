#!/bin/sh
set -e

env

echo "Starting nodejs"

cd /app

COMMAND="${COMMAND:-pnpm run start}"

echo "Using command : $COMMAND"

exec $COMMAND