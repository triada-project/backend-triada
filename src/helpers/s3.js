const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  AWS_BUCKET_REGION,
  AWS_PUBLIC_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
} = require('./config.js');
const fs = require('fs');

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(file, id) {
  const stream = fs.createReadStream(file.tempFilePath);
  const userId = id; //'662b36a30fd23add7064652a';
  const bin = `${userId}/${file.name}`;
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: bin,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  return await client.send(command);
}

module.exports = {
  uploadFile,
};
