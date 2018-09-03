"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tyreSchema = new Schema({
	type_of_product: {type: String, default: "Renkaat"},
	manufacturer: {type: String, required: true},
	model: {type: String, required: true},
	size_and_price: [
			{
				size: String,
				unit_price: Number,
				tax: Number,
				unit_price_excluding_tax: Number
			}
	],
	ean: String,
	cover: String,
	cover_id: String,
	additional_info: [{type: String}],
	category: String,
	car_type: String,
	vat: {type: Number, default: 24}
}, 
{
	usePushEach: true,
	timestamps: true
});
tyreSchema.methods.getMinPrice = function() {
	var prices = this.size_and_price.map((price) => {
		return price.unit_price;
	});
	var minPrice = Math.min.apply(null, prices);
	return minPrice;
};
tyreSchema.methods.getMinPriceSize = function() {
	var prices = this.size_and_price.map((price) => {
		return price.unit_price;
	});
	var minPrice = Math.min.apply(null, prices);
	var minPriceSize = this.size_and_price.filter((price_and_size) => {
		if(price_and_size.unit_price === minPrice) {
			return price_and_size.size;
		}
	});
	return minPriceSize[0].size;
};
tyreSchema.methods.getPrice = function(size) {
	var prices = this.size_and_price.filter((size_price) => {
		return size_price.size === size ? size_price.unit_price : false;
	});
	var Price = prices[0].unit_price;
	return Price;
};
tyreSchema.methods.getPriceSize = function(size) {
	var sizes = this.size_and_price.filter((size_price) => {
		return size_price.size === size ? size_price.size : false;
	});
	return sizes[0].size;
};
tyreSchema.index({manufacturer: "text", model: "text", cart_ype: "text", size: "text"});
module.exports = mongoose.model("Tyre", tyreSchema);