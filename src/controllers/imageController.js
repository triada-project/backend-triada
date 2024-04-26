const { uploadFile } = require('../helpers/s3');

async function uploadImage(req, res) {
  try {
    const result = await uploadFile(req.files.file);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  uploadImage,
};
