# Badanamu Learning Pass Frontend

BLP Frontend uses 3 differents branches for developing, testing and deploying (`master`, `beta` and `prod`).

To push changes from `master` to `beta`, simply, create a Pull-Request with Fast-Forward merge strategy to merge from master to beta. To push on prod, same idea with `beta` to `prod`.

## Building and Deploying

### Prerequisites

Install the dependencies: `npm install`

### Run locally

Make sure to be on a local development branch based on `master`

#### Use local server

`npm run start`

#### Use internal server

`npm run start:internal`

### Build for Beta

Make sure to be on `beta` and then `npm run build`

### Build for Pre-Production

Make sure to be on `prod` and then `npm run build:test`

### Build for Production

Make sure to be on `prod` and then `npm run build:prod`

### Open the development dashboard

Append `?test#/` to the end of the URL.

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