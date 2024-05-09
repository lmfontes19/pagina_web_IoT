const express = require('express');
const router = express.Router();
const poolController = require('../controllers/pool');
const validateAdmin = require('../controllers/auth');
const auth = require('../controllers/auth');

router.get('/show',poolController.getpool);
router.post('/add',poolController.addPool);
module.exports = router;