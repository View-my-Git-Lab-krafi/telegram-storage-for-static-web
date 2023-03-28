const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
// Initialize Express app
const app = express();

app.use(bodyParser.json());
app.use(cors());
// Create a database connection
const db = new sqlite3.Database('./comments.db');

// Create the comments table
db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY,
  text TEXT,
  username TEXT,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)

  `);
});

// Add a new comment
app.post('/comments', (req, res) => {
  const { text, username } = req.body;

  db.run(`
    INSERT INTO comments (text, username)
    VALUES (?, ?)
  `, [text, username], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    return res.sendStatus(201);
  });
});


// Get all comments
app.get('/comments', (req, res) => {
  db.all(`
    SELECT * FROM comments
  `, (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    const comments = rows.map((row) => {
      const { id, text, username, likes, dislikes, created_at } = row;
      return { id, text, username, likes, dislikes, created_at };
    });

    return res.send(comments);
  });
});


app.listen(3000, () => console.log('Server started on port 3000'));


