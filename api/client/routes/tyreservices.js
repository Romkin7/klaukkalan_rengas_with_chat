"use strict";
const express = require('express');
const router = express.Router();
const tyreServiceCtrl = require('../controllers/tyreServiceCtrl');
// "/tyreservices"
router
	.route('/')
	.get(tyreServiceCtrl.getTyreServicePage);
// export router
module.exports = router;
