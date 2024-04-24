const express = require("express");
const router = express.Router();
const path = require("path");
const admin_poolController = require('../controllers/admin_home');
const validateAdmin = require('../controllers/auth_admin');

router.post('/add',validateAdmin,admin_poolController.addPool);
router.delete('/delete/:id', validateAdmin, admin_poolController.deletePool);
router.put('/update/:id', validateAdmin, admin_poolController.updatePool);

module.exports = router;