const { uploadFile } = require('../helpers/s3');

async function uploadImage(req, res) {
  const { id } = req.params;
  try {
    const result = await uploadFile(req.files.file, id);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  uploadImage,
};
