const express = require('express');
const router = express.Router();
const poolController = require('../controllers/pool');

router.get('/show',poolController.getpool);

module.exports = router;