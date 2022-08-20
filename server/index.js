import { database } from './database.js';
import express from 'express';
import logger from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use('/', express.static('client'));

// the /add endpoint = ALLSET
app.get('/add', async (req, res) => {
  try {
    const { name, category, numPlayers, playTime } = req.query;
    await database.addGame(name, category, numPlayers, playTime);
    res.body = {
      "status": "success"
     };
     res.send(JSON.stringify(res.body));
     res.end();
  } catch (err) {
    res.status(500).send(err);
  }
});

// the /rateThisGame endpoint = ALLSET
app.get('/rateThisGame', async (req, res) => {
  try {
    const { name, username, rating } = req.query;
    await database.addRating(name, username, rating);
    res.body = {
      "status": "success"
     };
     res.send(JSON.stringify(res.body));
     res.end();
  } catch (err) {
    res.status(500).send(err);
  }
});

// the /allGames endpoint = ALLSET
app.get('/allGames', async (req, res) => {
  try {
    const all = await database.getAllGames(); // returns array
    res.send(JSON.stringify(all));
    res.end();
  } catch (err) {
    res.status(500).send(err);
  }
});

// the /randomGG endpoint
app.get('/randomGG', async (req, res) => {
  try {
    const g = await database.randomGG(); // returns game obj
    res.send(JSON.stringify(g));
    res.end();
  } catch (err) {
    res.status(500).send(err);
  }
});




// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
  const msg = `Server started on http://localhost:${port}`;
  console.log(msg);
});