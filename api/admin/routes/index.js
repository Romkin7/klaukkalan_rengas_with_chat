"use strict";
const express = require('express');
const router = express.Router();
const indexCtrl = require('../controllers/indexCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
router
	.route('/')
	.get(adminAuthObj.isAdmin, indexCtrl.getAdminPanel);
module.exports = router;