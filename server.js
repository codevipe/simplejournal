const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const jwt = require('express-jwt');
const MongoClient = require('mongodb').MongoClient;

dotenv.load();

const app = express();
const port = process.env.PORT || 3001;

const dbName = process.env.MLAB_DB_NAME;
const dbUser = process.env.MLAB_DB_USER;
const dbPass = process.env.MLAB_DB_PASS;
const mongoUrl = `mongodb://${dbUser}:${dbPass}@ds139438.mlab.com:39438/${dbName}`;

const jwtCheck = jwt({
  secret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_CLIENT_ID,
});

/* eslint-disable consistent-return */
/* eslint-disable no-console */

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(logger('dev'));
app.use(cookieParser());


app.use('/api', jwtCheck); // auth jwt before allowing access to api endpoints
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({ error: 'Invalid token!' });
  }
});

// Express only serves static client assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// only start server if MongoDB connection made
MongoClient.connect(mongoUrl, (err) => {
  if (err) throw err;
  http.createServer(app).listen(port, (err) => {
    if (err) throw err;
    console.log(`Find the server at: http://localhost:${port}/`);
  });
});

module.exports = app;
