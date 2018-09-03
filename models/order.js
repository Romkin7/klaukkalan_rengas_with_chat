"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define order schema
const OrderSchema = new Schema({
	client: {
		name: {
			firstname: {type: String, required: true},
			lastname: {type: String, required: true}
		},
		address: {
			street: {type: String},
			index: {type: String},
			city: {type: String}
		},
		register_number: {type: String, required: true},
		contact_information: {
			phone: {type: String, required: true},
			email: {type: String, required: true}
		}
	},
	time: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Calendar"
	},
	services: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service"
	}], 
	status: {type: String, default: "pending"}
},
{
	usePushEach: true,
	timestamps: true
});
// set Schema indexes
OrderSchema.index({register_number: "text", name: "text"});
// esport order as mongoose model
module.exports = mongoose.model("Order", OrderSchema);