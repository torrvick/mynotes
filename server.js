const express = require('express');
// const { title } = require('process');
// const escapeHtml = require('escape-html');
// const cheerio = require('cheerio');
const ld = require('lodash');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const DATABASE = 'notes.db';

const db = new sqlite3.Database(DATABASE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
      )
    `);
  }
});

app.use(express.json());

// Получение списка заметок

app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  console.log(noteId);
  db.get('SELECT * FROM notes WHERE id = ?', [noteId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });
});

app.post('/api/notes', (req, res) => {
  // console.log(req.body);
  let { content } = req.body;

  // let title = '';
  // if (content.startsWith('#')) {
  //   title = content.substring(0, content.indexOf('\n')).replace(/^[^a-zA-Zа-яА-Я]+/, '');
  //   content = content.substring(content.indexOf('\n') + 1);
  // }

  content = content.replace(/```([\s\S]*?)```|([^`]+)(?=(?:[^`]*`[^`]*`)*[^`]*$)/g, (match, p1, p2) => {
    if (p1) {
      return match;
    } else {
      return ld.escape(p2);
    }
  });
  // console.log(content);
  db.run('INSERT INTO notes (content) VALUES (?)', [content], (err) => {
    if (err) {
      // console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Note added successfully' });
    }
  });
});

app.put('/api/notes/:id', (req, res) => {
  console.log(req.body);
  const { content } = req.body;
  const id = req.params.id;
  // console.log(id + '---------' + content);
  db.run('UPDATE notes SET content = ? WHERE id = ?', [content, id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Note updated successfully' });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM notes WHERE id = ?', id, (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Note deleted successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

