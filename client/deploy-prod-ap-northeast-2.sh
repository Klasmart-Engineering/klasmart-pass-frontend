#!/usr/bin/env bash
npm i
npm run build:prod
aws s3 sync dist s3://auth.kidsloop.net/account --dryrun
sleep 15
aws s3 sync dist s3://auth.kidsloop.net/account
aws cloudfront create-invalidation --paths "/account*" --distribution-id E134FIUH68FUOQ #auth.kidsloop.net
