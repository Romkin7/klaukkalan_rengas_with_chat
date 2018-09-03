"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema = new Schema({
	name: String,
	flter_name: {type: String},
	type: String,
	vat: Number,
	unit_price: Number,
	unit_price_excluding_tax: Number,
	tax: Number,
	discounted_tax: Number,
	discounted_unit_price: Number,
	discounted_unit_price_excluding_taxes: Number,
	tyre_size: Number,
	additional_info: String,
	category: String	
});
//Export serviceSchema
module.exports = mongoose.model("Service", serviceSchema);