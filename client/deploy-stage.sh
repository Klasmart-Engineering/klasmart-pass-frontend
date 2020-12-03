#!/usr/bin/env bash
npm i
npm run build:prod
aws s3 sync dist s3://auth.kidsloop.net/account/stage --dryrun
sleep 5
aws s3 sync dist s3://auth.kidsloop.net/account/stage
aws cloudfront create-invalidation --paths "/account/stage*" --distribution-id E134FIUH68FUOQ #auth.kidsloop.net
