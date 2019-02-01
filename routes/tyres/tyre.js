"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tyre = require("../../models/tyre");
const paginate = require('../../middleware/paginate');
const helpers = require('../../middleware/helperFunctions');
let manufacturers = [];
let queryObj = {};
let sortObj = {};
let queryString = "";
//route to get all tyres by selected category
router.get("/", async (req, res, next) => {
	//Set title
	queryString = "";
	queryObj = {};
	manufacturers = await Tyre.aggregate([{$group: {_id: "$manufacturer", total: {$sum: 1}}}]);
	manufacturers = await manufacturers.map((manufacturer) => {return manufacturer._id});
	if(req.query && req.query.size) {
		queryObj = {
			"category": req.query.category,
			"car_type": req.query.car_type ? req.query.car_type : "Henkilöauto",
			"manufacturer": req.query.manufacturer ? req.query.manufacturer : manufacturers,
			"size_and_price.size": req.query.size
		};
	} else if(req.query.search) {
		queryString = await new RegExp(helpers.escapeRegex(req.query.search));
		queryObj = {$or: [{"size": queryString}, {"car_type": queryString},{"category": queryString}, {"manufacturer": queryString}]}
	} else {
		queryObj = {
			"category": req.query.category,
			"manufacturer": req.query.manufacturer ? req.query.manufacturer : manufacturers,
			"car_type": req.query.car_type ? req.query.car_type : "Henkilöauto"
		};
	}
	//Set sort object
	sortObj = {
		"size_and_price.unit_price": 1,
		"createdAt": -1
	};
	console.log(queryObj);
	paginate.paginate(req, res, Tyre, queryObj, sortObj,  (err, output) => {
		if(err) {
			if(req.xhr) {
				return res.status(204).json({
					message: `Valitettavasti ei löytynyt yhtään hakutulosta.`
				});
			} else {
				req.flash("error", "Valitettavasti ei löytynyt yhtään hakutulosta.");
				return res.redirect(req.session.errorReturnUrl ? req.session.errorReturnUrl : "/renkaat");
			}
			return;
		}
		if(req.xhr) {
			return res.status(200).json({
				tyres: output.data,
				pages: output.pages,
				items: output.items,
				page_heading: helpers.setTitle(req.query.category, req.query.car_type, queryString, req.query.size),
				size: req.query.size ? req.query.size : "",
				manufacturer: req.query.manufacturer ? req.query.manufacturer : "",
				manufacturers: manufacturers,
				car_type: req.query.car_type ? req.query.car_type : "Henkilöauto",
				heading: req.query.category,
				searchTerm: req.query.search ? req.query.search : "",
				category: req.query.category
			});
			return;
		} else {
			return res.render("tyres/tyres", {
				tyres: output.data,
				pages: output.pages,
				items: output.items,
				page_heading: helpers.setTitle(req.query.category, req.query.car_type, queryString, req.query.size),
				size: req.query.size ? req.query.size : "",
				manufacturer: req.query.manufacturer ? req.query.manufacturer : "",
				car_type: req.query.car_type ? req.query.car_type : "Henkilöauto",
				heading: req.query.category,
				manufacturers: manufacturers,
				searchTerm: req.query.search ? req.query.search : "",
				category: req.query.category
			});
		}
	});
});
//Get one tyre
router.get("/:id", async (req, res, next) => {
	let tyre = await Tyre.findById(req.params.id);
	res.render("tyres/show", {
		tyre: tyre
	});
});
//Export router
module.exports = router;