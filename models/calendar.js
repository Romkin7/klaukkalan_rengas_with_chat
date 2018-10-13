"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CalendarSchema = new Schema({
	day: Date,
	time: String,
	taken: {type: Boolean, default: false},
	quantity: {type: Number, default: 3}
});

module.exports = mongoose.model("Calendar", CalendarSchema);