"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  total: {type: Number, default: 0},
  total_price_excluding_tax: {type: Number, default: 0},
  total_tax_amount: {type: Number, default: 0},
  total_price_including_tax: {type: Number, default: 0},
  total_price: {type: Number},
	items: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }
  ],
  expires: {type: Date},
  times: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calendar"
  }]
},
{
  timestamps: true,
  usePushEach: true
});
module.exports = mongoose.model("Cart", cartSchema);