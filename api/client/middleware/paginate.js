"use strict";
const mongoose = require('mongoose');
const Tyre = require("../../../models/tyre");
//Variables that can be modified in code.
var page = 1;
var perPage = 28;
var queryString = "";
var title = "Uudet";
var queryObj = {"status": "available", "type": type, "category": "Uudet"};
var sortObj = {"createdAt": -1};
//initalize output
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
function init(req, res, next) {
	output.pages.visiblePages = [];
	type = "lp";
	queryString = "";
	
	queryObj = {"status": "available", "type": type, "category": "Uudet"};;
	genre = "";
	category = "";
	if(req.query && req.query.page) {
		page = parseInt(req.query.page, 10);
	}
	if(req.query && req.query.perPage) {
		perPage = parseInt(req.query.perPage, 10);
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
	}
	if(req.query && req.query.category) {
		if(req.query.category === "Oheistarvikkeet") {
			type = "muut";
		}
		category = req.query.category;
		title = req.query.category;
		queryObj = {"status": "available", "category": req.query.category, "type": type};
	}
	if(req.query && req.query.genre) {
		genre = req.query.genre;
		title = req.query.genre;
		queryObj = {"status": "available", "genre": req.query.genre, "type": type};
	}
	if(req.query && req.query.SortByCreatedAt) {
		title = "Viimeisimmät lisäykset";
		sortObj = {"createdAt": parseInt(req.query.SortByCreatedAt, 10)};
	}
	if(req.query && req.query.SortByTitle) {
		if(parseInt(req.query.SortByTitle, 10) === -1) {
			title = "Suodatus aakkosittain Z-A";
		} else {
			title = "Suodatus aakkosittain A - Z";
		}
		sortObj = {"title": parseInt(req.query.SortByTitle, 10)};
	}
	if(req.query && req.query.SortByQuantity) {
		title = "Suodatus varastomäärän mukaan";
		sortObj = {"total_quantity": parseInt(req.query.SortByQuantity, 10)};
	}
	if(req.query && req.query.SortByPrice) {
		if(parseInt(req.query.SortByPrice, 10) === -1) {
			title = "Kalleimmat ensin";
		} else {
			title = "Halvimmat ensin";
		}
		sortObj = {"unit_price": parseInt(req.query.SortByPrice, 10)};
	}
};
function setOutput(items, count) {
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
};
//Method for "/products" route
module.exports.paginateItems = (req, res, items, next) => {
	init(req, res, next);
	if(queryString !== "") {
		items.find({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
		.skip((page - 1) * perPage)
    	.limit(perPage)	
		.sort(sortObj)
		.exec((err, things) => {
			if(err || !things) {
				req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
				return res.redirect("/lp:t");
			} else {
				items.count({$or: [{'title': queryString}, {'name': queryString}, {'label': queryString}, {'ean': queryString}, {'fullname': queryString}]})
				.exec((err, count)=> {
					if(err || !count) {
						req.flash("error", `Valitettavasti hakusanalla "${req.query.search}", ei löytynyt yhtään hakutulosta.`);
						return res.redirect("/lp:t");
					} else {
						setOutput(things, count);
						res.render("product/index.ejs", {
							search: req.query.search,
							products: output.data,
							pages: output.pages,
							items: output.items,
							genre: genre,
							category: category,
							title: "Tuloksia hakusanalle: '"+req.query.search+"'"
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
				req.flash("error", "Tässä tuotekategoriassa ei löytynyt yhtään hakutulosta.");
				return res.redirect("back");

			} else {
				items.count(queryObj)
				.exec((err, count)=> {
					if(err || !count) {
						req.flash("error", "Tässä tuotekategoriassa ei löytynyt yhtään hakutulosta.");
						return res.redirect("back");
					} else {
						setOutput(things, count);
						res.render("product/index.ejs", {
							search: queryString,
							products: output.data,
							pages: output.pages,
							items: output.items,
							genre: genre,
							category: category,
							title: title
						});
						return;
					}
				});
			}
		});
	}
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};