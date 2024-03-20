const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection setup
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password:"",
  database: 'code_snippets', 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Route to handle code snippet submissions
app.post('/api/code-snippets', (req, res) => {
  const { username, codeLanguage, stdin, sourceCode } = req.body;
  const submissionTimestamp = new Date().toISOString();

  const sql = `INSERT INTO code_snippets (username, code_language, stdin, source_code, submission_timestamp) VALUES (?, ?, ?, ?, ?)`;
  connection.query(sql, [username, codeLanguage, stdin, sourceCode, submissionTimestamp], (err, result) => {
    if (err) {
      console.error('Error inserting code snippet:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Code snippet inserted successfully');
    res.status(201).json({ message: 'Code snippet submitted successfully' });
  });
});

// Route to handle code snippet retrieval
app.get('/api/code-snippets', (req, res) => {
  const sql = `SELECT username, code_language, stdin, LEFT(source_code, 100) as source_code_short, submission_timestamp FROM code_snippets`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving code snippets:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log('Code snippets retrieved successfully');
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
