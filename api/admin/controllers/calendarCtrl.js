"use strict";
const mongoose = require('mongoose');
const Calendar = require('../../../models/calendar');
module.exports.postTime = (req, res, next) => {
	var calendar = new Calendar();
	calendar.day = req.body.day;
	calendar.time = req.body.time;
	calendar.save((err, newDayWithTimes) => {
		if(err) {
			return res.status(500).json({
				error: err,
				message: err.message
			});
		} else {
			res.status(200).json({calendar: newDayWithTimes});
		}
	});
};
