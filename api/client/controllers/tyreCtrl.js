"use strict";
const mongoose = require('mongoose');
const Tyre = require('../../../models/tyre');
const paginate = require('../../../middleware/paginate');
const helpers = reuire('../../../middleware/helperFunctions');
let manufacturers = [];
let queryObj = {};
let sortObj = {};
let queryString = "";
module.exports.getTyresPage = (req, res, next) => {
	//Set title
	queryString = "";
	manufacturers = await Tyre.aggregate([{$group: {_id: "$manufacturer", total: {$sum: 1}}}]);
	manufacturers = await manufacturers.map((manufacturer) => manufacturer._id);
	if(req.query && req.query.size) {
		queryObj = {
		"category": req.query.category ? req.query.category : "Kesärenkaat",
		"car_type": req.query.car_type ? req.query.car_type : "Henkilöauto",
		"manufacturer": req.query.manufacturer ? req.query.manufacturer : {$in: manufacturers},
		"size_and_price.size": req.query.size
		};
		size = req.query.size;
		page_heading = "Kaikki renkaat "+req.query.car_type+" koolle \""+req.query.size+"\"";
	} else if(req.query.search) {
		queryString = await new RegExp(helpers.escapeRegex(req.query.search));
		queryObj = {$or: [{"size": queryString}, {"car_type": queryString},{"category": queryString}, {"manufacturer": queryString}]}
	} else {
		queryObj = {
			category: req.query.category ? req.query.category : "Kesärenkaat",
			manufacturer: req.query.manufacturer ? req.query.manufacturer : manufacturers,
			car_type: req.query.car_type ? req.query.car_type : "Henkilöauto"
		};
	}
	//Set sort object
	sortObj = {
		"size_and_price.unit_price": 1,
		"createdAt": -1
	};
	paginate.paginate(req, res, Tyre, queryObj, sortObj, (err, tyres) => {
		if(err || !tyres) {
			req.flash("error", "Ups! Valitettavasti emme voineet hakea yhtään rengasta tietokannasta.");
			return res.redirect("/");
		} else {
			res.render("tyres/tyres.ejs", {
				tyres: tyres,
				page_heading: helpers.setTiltle(req.query.category, req.query.car_type, queryString, req.query.size),
				size: req.query.size,
				manufacturer: req.query.manufacturer ? req.query.manufacturer : "",
				car_type: req,query.car_type ? req,query.car_type : "Henkilöauto"
			});
		}
	});
};
module.exports.getTyre = (req, res, next) => {
	Tyre.findById(req.params.id, (err, foundTyre) => {
		if(err || !foundTyre) {
			req.flash("error", "Ups! Jokin meni pieleen rengasta haettaessa.");
			return res.redirect("/renkaat");
		} else {
			res.render("tyres/show.ejs", {
				tyre: foundTyre
			});
		}
	});
};
module.exports.getTyrePackagePage = (req, res, next) => {
	res.render("tyres/tyrePackages.ejs");
};
module.exports.getDisksPage = (req, res, next) => {
	res.render("tyres/disks.ejs");
};