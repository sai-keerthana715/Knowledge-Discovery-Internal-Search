
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const db = require('../db');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

async function extractText(filePath, mimetype) {
  const data = fs.readFileSync(filePath);
  if (mimetype === 'application/pdf') {
    try {
      const parsed = await pdf(data);
      return parsed.text || '';
    } catch (err) {
      console.error('PDF parse failed, continuing without text:', err.message);
      // Return empty string so upload still succeeds
      return '';
    }
  }
  // For other file types we’re not extracting text
  return '';
}


router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const filetype = file.mimetype;
    const filepath = file.path;
    const filename = file.originalname;
    const uploadedAt = new Date().toISOString();

    const insert = db.prepare('INSERT INTO docs (filename, filepath, filetype, uploaded_at) VALUES (?,?,?,?)');
    const info = insert.run(filename, filepath, filetype, uploadedAt);
    const id = info.lastInsertRowid;

    const content = await extractText(filepath, filetype);
    const ftsInsert = db.prepare('INSERT INTO docs_fts(rowid, content, filename, filetype) VALUES (?, ?, ?, ?)');
    ftsInsert.run(id, content, filename, filetype);

    res.json({ ok: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
