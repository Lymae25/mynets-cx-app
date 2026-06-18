const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./data.db');

db.run(`CREATE TABLE IF NOT EXISTS metrics (
  id TEXT PRIMARY KEY,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(express.json());
app.use(express.static('public'));

app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM metrics', (err, rows) => {
    const data = {};
    if (rows) rows.forEach(r => data[r.id] = r.value);
    res.json(data);
  });
});

app.post('/api/update', (req, res) => {
  const { id, value } = req.body;
  db.run('INSERT OR REPLACE INTO metrics (id, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [id, value], () => {
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running on port ' + PORT));
