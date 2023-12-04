const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use the body-parser middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up SQLite database
const db = new sqlite3.Database('./messages.db');

// Create the messages table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    timestamp TEXT
  )
`);

// Serve HTML and CSS
app.use(express.static('public'));

// API endpoint to get all messages
app.get('/api/messages', (req, res) => {
  db.all('SELECT * FROM messages', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

// API endpoint to post a new message
app.post('/api/messages', (req, res) => {
  const { text, timestamp } = req.body;

  if (!text) {
    res.status(400).send('Text is required.');
    return;
  }

  db.run('INSERT INTO messages (text, timestamp) VALUES (?, ?)', [text, timestamp], (err) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    res.send('Message posted successfully.');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
