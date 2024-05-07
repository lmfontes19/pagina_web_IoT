const express = require("express");
const router = express.Router();
const path = require("path");
const admin_poolController = require('../controllers/admin_home');
const validateAdmin = require('../controllers/auth_admin');

router.delete('/delete/:id', admin_poolController.deletePool);
router.put('/update/:id', admin_poolController.updatePool);
router.get('/get',admin_poolController.getPool);
router.get('/details/:id', admin_poolController.getPoolDetails);
module.exports = router;