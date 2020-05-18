#!/usr/bin/env bash
set -eux

export ENV=prodcution

AWS=${AWS:="aws"}
AWS_REGION=${AWS_REGION:="us-east-1"}
S3_BUCKET=${S3_BUCKET:?}

yarn clean
yarn build:prod

dirs=("./public" "./dist")

for i in "${dirs[@]}" ; do
    ${AWS} s3 cp "${i}" s3://"${S3_BUCKET}"/ --region ${AWS_REGION} --recursive --metadata-directive REPLACE --cache-control max-age=600
done
