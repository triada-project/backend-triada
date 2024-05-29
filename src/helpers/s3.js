const AWS = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });
const multerS3 = require('multer-s3');
const { s3 } = require('./config.js');

AWS.config.update({
  accessKeyId: s3.credentials.accessKeyId,
  secretAccessKey: s3.credentials.secretAccessKey,
  region: s3.region,
});

const s3Client = new S3Client(s3);

const multerS3Config = multerS3({
  s3: s3Client,
  bucket: s3.params.Bucket,
  // Omitir la configuración de `acl`
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});
const upload = multer({ storage: multerS3Config });

module.exports = { upload };

// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const {
//   AWS_BUCKET_REGION,
//   AWS_PUBLIC_ACCESS_KEY,
//   AWS_SECRET_ACCESS_KEY,
//   AWS_BUCKET_NAME,
// } = require('./config.js');
// const fs = require('fs');

// const client = new S3Client({
//   region: AWS_BUCKET_REGION,
//   credentials: {
//     accessKeyId: AWS_PUBLIC_ACCESS_KEY,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   },
// });

// async function uploadFile(file, id) {
//   const stream = fs.createReadStream(file.tempFilePath);
//   const userId = id; //'662b36a30fd23add7064652a';
//   const bin = `${userId}/${file.name}`;
//   const uploadParams = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: bin,
//     Body: stream,
//   };
//   const command = new PutObjectCommand(uploadParams);
//   return await client.send(command);
// }

// module.exports = {
//   uploadFile,
// };