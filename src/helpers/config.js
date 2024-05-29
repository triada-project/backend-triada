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

// const { config } = require('dotenv');

// config();

// const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
// const AWS_PUBLIC_ACCESS_KEY = process.env.AWS_PUBLIC_ACCESS_KEY;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// console.log(
//   AWS_BUCKET_NAME,
//   AWS_BUCKET_REGION,
//   AWS_PUBLIC_ACCESS_KEY,
//   AWS_SECRET_ACCESS_KEY,
// );

// module.exports = {
//   AWS_BUCKET_NAME,
//   AWS_BUCKET_REGION,
//   AWS_PUBLIC_ACCESS_KEY,
//   AWS_SECRET_ACCESS_KEY,
// };