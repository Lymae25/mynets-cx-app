const express = require('express');
const fs = require('fs');

const app = express();
const DATA_FILE = '/tmp/data.json';

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

app.use(express.json());
app.use(express.static('public'));

app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch(e) {
    res.json({});
  }
});

app.post('/api/update', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const { id, value } = req.body;
    data[id] = value;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ ok: true });
  } catch(e) {
    res.json({ ok: false });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Running on port ' + PORT));
