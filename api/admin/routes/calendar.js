"use strict";
const express 		= require('express');
const router 		= express.Router();
const calendarCtrl 	= require('../controllers/calendarCtrl');
router
	.route("/")
	.post(calendarCtrl.postTime);
module.exports = router;
