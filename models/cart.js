"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  total: {type: Number, default: 0},
  total_price_excluding_tax: {type: Number, default: 0},
  total_tax_amount: {type: Number, default: 0},
  total_price_including_tax: {type: Number, default: 0},
  total_price: {type: Number},
	items: [{
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    duration: Number
  }],
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
cartSchema.virtual("total_duration").get(function() {
  let durations = this.items.map((item) => item.duration);
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return durations.reduce(reducer);
});
module.exports = mongoose.model("Cart", cartSchema);