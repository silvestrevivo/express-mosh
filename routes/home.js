const express = require('express');
const router = express.Router();

// get requests
router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router;
