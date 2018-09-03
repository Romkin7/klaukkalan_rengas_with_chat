"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
	services: [
		{
			type: mongoose.Schema.Types.ObjectId, 
			ref: "Service"
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	isNewProduct: {type: Boolean, default: false},
	isOutOfStock: {type: Boolean, default: false},
	isRead: {type: Boolean, default: false},
},
{
	usePushEach: true,
	timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});
module.exports = mongoose.model("Notification", NotificationSchema);