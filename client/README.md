# Badanamu Learning Pass Frontend

BLP Frontend uses two different branches for testing and deploying (`master` and `production`). Please do not merge these two branches together. 

To push changes from `master` to `production`, use `git rebase master` while on the `production` branch.


## Building and Deploying


### Prerequisites

Install the dependencies: `npm install`


### Building from `master` or a branch from `master` (pre-production)

Check API Endpoints in `restapi.ts`, ensure that the subdomain is not `prod` (lines 16-19).

Building: `npm run build`

Running on a local server: `npm run start` (Please check console for localhost address).


### Building from `production` (production)

Check API Endpoints in `restapi.ts`, ensure that the subdomain is `prod` (lines 16-19).

Building: `npm run build`

Running on a local server: `npm run start` (Please check console for localhost address).


### Deploying


#### Amazon S3 Buckets

If files already exist, delete all the files in the bucket before uploading a new build. You will have approximately five (5) minutes to upload a new build after the previous one has been deleted.

For steps 2-4 in the upload process, proceed with the default settings, you do not need to change anything.


[AWS S3 Beta](https://s3.console.aws.amazon.com/s3/buckets/badanamu-beta-pass-site/?region=us-west-2&tab=overview)

[AWS S3 Production](https://s3.console.aws.amazon.com/s3/buckets/badanamu-pass-site/?region=us-west-2&tab=overview) 



#### Amazon Cloudfront

In the CloudFront distribution, go to the `Invalidations` tab to create a cache invalidation. After clicking `Create Invalidation`, type `/` under `Object Paths`, and then click `Invalidate`. This will ensure that new site visitors will see the newly uploaded build.

Beta ID: [EH0IZ1XK4JAWB](https://console.aws.amazon.com/cloudfront/home?region=ap-northeast-2#distribution-settings:EH0IZ1XK4JAWB)

Production ID: [E1HQOLXMD8JFIN](https://console.aws.amazon.com/cloudfront/home?region=ap-northeast-2#distribution-settings:E1HQOLXMD8JFIN)