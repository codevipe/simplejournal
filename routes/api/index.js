const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(401).send({
    error: 'No authorization token was found',
  });
  res.status(200).send({
    message: 'You\'re authenticated! Welcome to the API!',
  });
});

module.exports = router;
