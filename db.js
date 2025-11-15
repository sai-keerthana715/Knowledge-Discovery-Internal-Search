
const Database = require('better-sqlite3');
const db = new Database('knowledge.db');

db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS docs(
  id INTEGER PRIMARY KEY,
  filename TEXT,
  filepath TEXT,
  filetype TEXT,
  uploaded_at TEXT
);
CREATE VIRTUAL TABLE IF NOT EXISTS docs_fts USING fts5(content, filename, filetype, content='');
`);

module.exports = db;
