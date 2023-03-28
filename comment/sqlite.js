const sqlite3 = require('sqlite3').verbose();

// Create a new database
const db = new sqlite3.Database('./comments.db');

// Create the comments table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY,
      text TEXT,
      user_id INTEGER,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database created successfully');
});

// Close the database connection
db.close();
