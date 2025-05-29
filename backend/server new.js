const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = 1200;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const db = new Database('inventory.db');

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullName TEXT,
    hint1 TEXT,
    hint2 TEXT,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    minStock INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    imageUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS goodsOut (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    receiver TEXT NOT NULL,
    items TEXT NOT NULL -- JSON string
  );

  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

const saltRounds = 10;

// --- User registration ---
app.post('/register', async (req, res) => {
  const { username, password, fullName, hint1, hint2, imageUrl } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const stmt = db.prepare(`
      INSERT INTO users (username, password, fullName, hint1, hint2, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(username, hashedPassword, fullName || null, hint1 || null, hint2 || null, imageUrl || null);
    res.status(201).json({ message: 'User registered' });
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      console.error(e);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// --- User login ---
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Exclude password field in response
    const { id, fullName, hint1, hint2, imageUrl } = user;
    res.json({ id, username: user.username, fullName, hint1, hint2, imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- Items routes ---
app.get('/items', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items').all();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

app.post('/items', (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items array' });
  }
  try {
    const deleteAll = db.prepare('DELETE FROM items');
    const insert = db.prepare(`
      INSERT INTO items (id, name, minStock, stock, imageUrl)
      VALUES (@id, @name, @minStock, @stock, @imageUrl)
    `);

    const transaction = db.transaction((items) => {
      deleteAll.run();
      for (const item of items) {
        insert.run(item);
      }
    });
    transaction(items);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save items' });
  }
});

// --- Goods Out routes ---
app.get('/goodsOut', (req, res) => {
  try {
    const records = db.prepare('SELECT * FROM goodsOut ORDER BY date DESC').all();
    const parsed = records.map(r => ({ ...r, items: JSON.parse(r.items) }));
    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch goods out records' });
  }
});

app.post('/goodsOut', (req, res) => {
  const { receiver, items } = req.body;
  if (!receiver || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO goodsOut (date, receiver, items)
      VALUES (?, ?, ?)
    `);
    stmt.run(new Date().toISOString(), receiver, JSON.stringify(items));
    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to save goods out record:', error);
    res.status(500).json({ error: 'Failed to save goods out record' });
  }
});

// --- Issue report routes ---
app.get('/issues', (req, res) => {
  try {
    const issues = db.prepare('SELECT * FROM issues ORDER BY createdAt DESC').all();
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.post('/issues', (req, res) => {
  const { title, description, status, createdAt } = req.body;
  if (!title || !description || !status || !createdAt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const stmt = db.prepare(`
      INSERT INTO issues (title, description, status, createdAt)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(title, description, status, createdAt);
    res.status(201).json({ id: info.lastInsertRowid, title, description, status, createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save issue' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
