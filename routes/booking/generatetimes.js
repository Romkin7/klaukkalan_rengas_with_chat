"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Calendar = require('../../models/calendar');
const adminAuthObj = require('../../api/admin/middleware/adminAuthObj');
// Utility functions
const util = require("../../lib/util");
function getSequenceValue(sequence_value) {
	return 
}
async function getMaxId(times) {
	var max = await times.reduce(function(a, b) {
    	return Math.max(a, b);
	});
	return max;
};
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
router.post("/generate-times-save-to-database", adminAuthObj.isAdmin, async(req, res) => {
	const existing_times = await Calendar.find({});
	const time_ids = await existing_times.map((time) => {
		return time._id;
	});
	let max_id;
	if(existing_times && existing_times.length) {
		max_id = await getMaxId(time_ids);
	} else {
		max_id = 0;
	}
	const year = req.body.year;
	const month = req.body.month;
	const check = req.body.check;
	// save the times in time constants
	const times = util.generateTimes(max_id, year, month);
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