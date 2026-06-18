const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS metrics (
    id TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/data', (req, res) => {
  const rows = db.prepare('SELECT * FROM metrics').all();
  const data = {};
  rows.forEach(r => data[r.id] = r.value);
  res.json(data);
});

app.post('/api/update', (req, res) => {
  const { id, value } = req.body;
  db.prepare('INSERT OR REPLACE INTO metrics (id, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').run(id, value);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));
