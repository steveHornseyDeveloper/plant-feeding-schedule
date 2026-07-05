#!/bin/sh
set -e
node_modules/.bin/prisma migrate deploy
exec node /app/apps/api/dist/main.js
