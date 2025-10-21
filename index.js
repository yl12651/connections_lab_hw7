import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();

// route 1
app.use('/', express.static('public'));

const defaultData = { posts: [] };
const adapter = new JSONFile('./data/db.json');
const db = new Low(adapter, defaultData);

//to parse JSON
app.use(express.json());

// route 2
app.get('/data', async (_, res) => {
  await db.read();
  if (!db.data) {
    db.data = { posts: [] };
  }
  res.json({ posts: db.data.posts });
});

// route 3
app.post('/new-data', async (req, res) => {
  const { gameName, groupSize, description } = req.body ?? {};

  // request body
  const post = {
    id: Date.now(),
    gameName,
    groupSize,
    description
  };

  // reorder so new post is appended to the start position of the db
  db.data.posts.unshift(post);
  await db.write();

  res.status(201).json({
    success: true,
    message: 'Looking for group post added.',
    post
  });
});

app.listen(3000, () => {
  console.log(`listening at localhost:3000`);
});
