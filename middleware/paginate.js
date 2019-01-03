"use strict";
const mongoose = require('mongoose');
const Tyre = require("../models/tyre");
const User = require("../models/user");
var page = 1;
var perPage = 32;
var title = "RengasCenter Klaukkala - Renkaat Klaukkala";
var car_type = "Henkilöauto";
let manufacturers;
let size = "";
var queryString = "";
var queryObj = {};
var sortObj = {};
var output = {
	data: null,
	pages: {
		start: 1,
		end: 1,
		current: page,
		next: 0,
		hasNext: false,
		prev: 0,
		hasPrev: false,
		total: 0,
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
//initialize settings function
const init = async function(req, res, category, done) {
	page = 1;
	output.pages.visiblePages = [];
	//Set title
	queryString = "";
	if(category === "user") {
		title = "Käyttäjähallinta";
		queryObj = {
			"admin.isAdmin": req.query.admin === "true" ? false : true
		};
		sortObj = {
			"createdAt": -1
		};
		if(req.query && req.query.search) {
			if(req.query.search === "undefined" || req.query.search === undefined) {
				queryString = "";
			} else {
				queryString = new RegExp(escapeRegex(req.query.search), "gi");
				return done(null, true);
			}
		}
		return done(null, true);
	} else {
		manufacturers = await Tyre.aggregate([{$group: {_id: "$manufacturer", total: {$sum: 1}}}]);
		manufacturers = await manufacturers.map((manufacturer) => manufacturer._id);
		queryObj = {
			category: category !== undefined ? category : "Kesärenkaat",
			manufacturer: req.query.manufacturer ? req.query.manufacturer : manufacturers,
			car_type: req.query.car_type ? req.query.car_type : "Henkilöauto"
		};
		//Set sort object
		sortObj = {
			"createdAt": -1,
			"name": 1,
			"brand": 1
		};
		if(req.query && req.query.page) {
			page = parseInt(req.query.page, 10);
		}
		if(req.query && req.query.perPage) {
			perPage = parseInt(req.query.perPage, 10);
		}
		if(req.query && req.query.search) {
			if(req.query.search === "undefined" || req.query.search === undefined) {
				queryString = "";
			} else {
				queryString = new RegExp(escapeRegex(req.query.search), "gi");
				return done(null, true);
			}
		}
		if(title && queryObj && sortObj && page && perPage) {
			return done(null, true);
		}
	}
};
//Set output function
function setOutput(items, count, cb) {
	//Set items
	output.items.total = count;
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
	return cb(null, true);
};
module.exports.paginateItems = async (req, res, items, category, cb) => {
	init(req, res, category, ((err, done) => {
		if(done) {
			if(queryString !== "") {
				items.find({$or: [{"size": queryString}, {"car_type": queryString},{"category": queryString}, {"manufacturer": queryString}]})
				.skip((page - 1) * perPage)
				.limit(perPage)	
				.sort(sortObj)
				.exec((err, things) => {
					if(err || !things) {
						return cb({"status": 404, "message": `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`});
					} else {
						items.count({$or: [{"size": queryString}, {"car_type": queryString},{"category": queryString}, {"manufacturer": queryString}]})
						.exec((err, count)=> {
							if(err || !count) {
								return cb({"status": 404, "message": `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`});
							} else {
								setOutput(things, count, () => {
									return cb({
										search: queryString,
										output: output
									});
									return;
								});
							}
						});
					}
					return;
				});
			} else {
				items.find(queryObj)
				.skip((page - 1) * perPage)
				.limit(perPage)	
				.sort(sortObj)
				.exec((err, things) => {
					if(err || !things) {
						req.flash("error", "Извиняемся, на сервере возникла временная проблема с базой данных...");
						return res.redirect("back");
					} else {
						items.count(queryObj)
						.exec((err, count)=> {
							if(err || !count) {
								req.flash("error", "Извиняемся, на сервере возникла временная проблема с базой данных...");
								return res.redirect("back");
							} else {
								setOutput(things, count, () => {
									return cb({
										search: queryString,
										output: output,
										page_heading: title,
										car_type: car_type,
										manufacturer: req.query.manufacturer !== undefined ? req.query.manufacturers : "Kaikki",
										size: size
									});
									return;
								});
							}
						});
					}
				});
			}
		}
	}));
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};