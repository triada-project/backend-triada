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
