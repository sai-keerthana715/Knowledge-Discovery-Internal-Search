
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json({ results: [] });

  const stmt = db.prepare(`
    SELECT d.id, d.filename, d.filetype, d.uploaded_at,
      snippet(docs_fts, 0, '<b>', '</b>', '...', 50) AS snippet
    FROM docs_fts JOIN docs d ON d.id = docs_fts.rowid
    WHERE docs_fts MATCH ?
    LIMIT 50
  `);

  try {
    const rows = stmt.all(q + '*');
    res.json({ results: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
