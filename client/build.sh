#!/bin/bash
case $NODE_ENV in
  "production")
    yarn build:prod
    ;;
  "development")
    yarn build:dev
    ;;
esac
 