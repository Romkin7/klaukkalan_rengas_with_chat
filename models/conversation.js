"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
	messages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Message"
	}],
	participants: [{
		username: String,
		email: String,
	}]
},
{
	timestamps: true,
	usePushEach: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);  
