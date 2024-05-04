const express = require("express");
const router = express.Router();
const path = require("path");
const admin_poolController = require('../controllers/admin_home');
const validateAdmin = require('../controllers/auth_admin');

router.delete('/delete/:id', validateAdmin, admin_poolController.deletePool);
router.put('/update/:id', validateAdmin, admin_poolController.updatePool);
router.get('/',admin_poolController.getPool);
module.exports = router;