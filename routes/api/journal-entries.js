const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const MongoClient = require('mongodb').MongoClient;

dotenv.load();

const router = express.Router();

const dbName = process.env.MLAB_DB_NAME;
const dbUser = process.env.MLAB_DB_USER;
const dbPass = process.env.MLAB_DB_PASS;
const mongoUrl = `mongodb://${dbUser}:${dbPass}@ds139438.mlab.com:39438/${dbName}`;

let db;
let journalEntries;

/* eslint-disable no-console */

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err);
  db = database;
  journalEntries = db.collection('journal_entries');
});

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.get('/', (req, res) => {
  res.json({ message: 'doo' });
});

router.post('/', (req, res) => {
  if (req.body.userId && req.body.date) {
    journalEntries.findOne({
      user_id: req.body.userId,
      created_at: { $gte: req.body.date },
    }, (err, doc) => {
      if (err) res.send(err);
      else if (doc) res.send(doc);
      else res.json({ message: 'No journal entry for today!' });
    });
  } else if (req.body.userId && req.body.journalEntry) {
    journalEntries.save({
      ...req.body.journalEntry,
      user_id: req.body.userId,
      updated_at: new Date(),
    }, { w: 1 }, (err, cursor) => {
      if (err) res.send(err);
      else if (cursor) res.send(cursor);
    });
  }
});

module.exports = router;
