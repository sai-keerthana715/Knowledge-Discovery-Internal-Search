
const db = require('./db');
const insertDoc = db.prepare('INSERT INTO docs (filename, filepath, filetype, uploaded_at) VALUES (?, ?, ?, ?)');
const insertFts = db.prepare('INSERT INTO docs_fts(rowid, content, filename, filetype) VALUES (?, ?, ?, ?)');

const samples = [
  { title: "Pricing Strategy", body: "We plan to increase prices next quarter.", type: "txt" },
  { title: "Campaign Brief Q3", body: "Target millennials with influencer marketing.", type: "txt" },
  { title: "Product Release Notes", body: "Version 2.1 includes performance updates.", type: "txt" }
];

samples.forEach(s => {
  const info = insertDoc.run(s.title, '', s.type, new Date().toISOString());
  insertFts.run(info.lastInsertRowid, s.body, s.title, s.type);
});

console.log("Seeded sample docs.");
