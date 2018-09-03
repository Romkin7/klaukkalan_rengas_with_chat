"use strict";
const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const MessageSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  author: {
    name: String,
    admin: Boolean,
    avatar: String
  }
},
{
  usePushEach: true,
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Message', MessageSchema); 
