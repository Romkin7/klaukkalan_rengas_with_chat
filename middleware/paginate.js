"use strict";
const mongoose = require('mongoose');
const User = require('../models/user');
const Tyre = require('../models/tyre');
let page = 1;
let perPage = 2;
let output = {
	data: null,
	pages: {
		start: 1,
		end: 1,
		current: 1,
		next: 1,
		hasNext: false,
		prev: 1,
		hasPrev: false,
		total: 1,
		first: 1,
		last: 1,
		visiblePages: []
	},
	items: {
		begin: ((page * perPage) - perPage) +1,
		end: page * perPage,
		total: 0
	}
};
async function init(req, res) {
	output.pages.visiblePages = [];
	if(req.query && req.query.page) {
		page = parseInt(req.query.page);
	}
	if(req. baseUrl === "/renkaat") {
		perPage = 2;
	} else {
		perPage = 7;
	}
	return;
};
//se output function async await fashion
async function setOutput(items, itemsCount, cb) {
	output.pages.visiblePages = [];
	//Set items
	output.items.total = Number(itemsCount);
	//Set Data
	output.data = items;
	//Set pages
	output.pages.total = Math.ceil(output.items.total / perPage);
	output.pages.current = page;
	if(output.pages.current < output.pages.total) {
		output.pages.next = Number(output.pages.current) + 1;
	} else {
		output.pages.next = 0;
	}
	output.pages.hasNext = (output.pages.next !== 0);
	output.pages.prev = Number(output.pages.current) -1;
	output.pages.hasPrev = (output.pages.prev !== 0);
	output.pages.last = Math.ceil(output.items.total / perPage);
	if(output.pages.last === 1) {
		output.pages.start = 1;
		output.pages.end = 1;
	}
	if(output.pages.total < 6) {
		output.pages.start = 1;
		output.pages.end = output.pages.last;
	}
	if(page === 1 && output.pages.total > 6 || output.pages.total === 6) {
		output.pages.start = 1;
		output.pages.end = 6;
	}
	if(output.pages.total > 6) {
		if(page === output.pages.total || page > (output.pages.total - 5) || page === (output.pages.total - 5)) {
			output.pages.start = output.pages.last - 5;
			output.pages.end = output.pages.last;
		}
		if(page !== 1 && page !== output.pages.total && parseInt(page) === output.pages.total - 5) {
			output.pages.start = output.pages.last - 6;
			output.pages.end = output.pages.last -1;
		}
		if(page !== 1 && page !== output.pages.total && parseInt(page) < output.pages.total - 5 && parseInt(page) !== output.pages.total - 5) {
			output.pages.start = output.pages.current -1;
			output.pages.end = output.pages.current + 5 - 1;
		}
	} 
	var count = output.pages.start;
	while(count <= output.pages.end) {
		output.pages.visiblePages.push(count);
		count++;
	};
	return;
};
module.exports.paginate = async(req, res, model, queryOptions, sortOptions, cb) => {
	await init(req, res);
	let items;
	let itemsCount;
	items = await model.find(queryOptions).skip((page - 1) * perPage).limit(perPage).sort(sortOptions);
	itemsCount = await model.countDocuments(queryOptions);
	if(!items || !itemsCount) {
		return cb(true, null);
	}
	await setOutput(items, itemsCount);
	cb(null, output);
};