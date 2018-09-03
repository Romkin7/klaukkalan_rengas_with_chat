"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CalendarSchema = new Schema({
	day: Date,
	time: String,
	taken: {type: Boolean, default: false}
});
module.exports = mongoose.model("Calendar", CalendarSchema);