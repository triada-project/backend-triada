const { config } = require('dotenv');
config();

module.exports = {
  s3: {
    credentials: {
      accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_BUCKET_REGION,
    httpOptions: {
      timeout: 90000,
    },
    params: {
      ACL: 'public-read',
      Bucket: process.env.AWS_BUCKET_NAME,
    },
  },
};
