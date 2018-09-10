"use strict";
const express = require('express');
const router = express.Router();
const adminAuthObj = require('../../api/admin/middleware/adminAuthObj');
// Utility functions
const util = require("../../lib/util");
// this route will get the year and month from the Admin, and sends a message for confirmation
router.post("/generate-times-confirmation", adminAuthObj.isAdmin, (req, res) => {
	const data = util.generateTimes(req.body.year, req.body.month, "data");
	res.send({
		message: `${data.quantity} bookable times were generated from 1st ${
			data.month
		} to ${data.days}th ${
			data.month
		}, are you sure that you want to save them into the Database?`
	});
});
// this route will get the year, month and check property from Admin, generates times and return 200 if success
router.post("/generate-times-save-to-database", adminAuthObj.isAdmin, (req, res) => {
	const year = req.body.year;
	const month = req.body.month;
	const check = req.body.check;
	// save the times in time constants
	const times = util.generateTimes(year, month);
	// save the times into database
	Calendar.insertMany(times, (err, results) => {
		if (err) return res.status(500).send();
		res.status(200).send();
	});
	// if admin wanted, remove all non-taken bookable times of past
	if (check) {
		Calendar.deleteMany({ taken: false }, err => {});
	}
});
module.exports = router;