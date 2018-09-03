"use strict";
const mongoose = require('mongoose');
const Tyre = require('../../../models/tyre');
const manufacturers = [
	"Nokian Renkaat", 
	"Nokian Nordman", 
	"Continental", 
	"Nexen",
	"Bridgestone",
	"Toyo",
	"Nordexx",
	"Sava",
	"Goodyear"
];
let manufacturer = "Kaikki";
let car_type = "";
let queryObj = {};
let queryString = "";
let size= null;
let page_heading = "RengasCenter Klaukkala - Renkaat Klaukkala";
function setQueryObj(req, res, next) {
	queryObj = {};
	size = null;
	manufacturer = req.query.manufacturer !== undefined ? req.query.manufacturer : req.query.manufacturer === "Kaikki" ? "Kaikki" : "Kaikki";
	car_type = req.query.car_type !== undefined ? req.query.car_type : "";
	page_heading = "RengasCenter Klaukkala - Renkaat Klaukkala";
	queryObj = {
		"category": "Kesärenkaat",
		"car_type": req.query.car_type !== undefined ? req.query.car_type : "Henkilöauto",
		"manufacturer": req.query.manufacturer === "Kaikki" ? {$in: manufacturers} : req.query.manufacturer === undefined ? {$in: manufacturers} : req.query.manufacturer
	};
	if(req.query && req.query.size) {
		queryObj = {
		"category": "Kesärenkaat",
		"car_type": req.query.car_type !== undefined ? req.query.car_type : "Henkilöauto",
		"manufacturer": req.query.manufacturer === "Kaikki" ? {$in: manufacturers} : req.query.manufacturer === undefined ? {$in: manufacturers} : req.query.manufacturer,
		"size_and_price.size": req.query.size
		};
		size = req.query.size;
		page_heading = "Kaikki renkaat "+req.query.car_type+" koolle \""+req.query.size+"\"";
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
		queryObj = {
			$or: [{'manufacturer': queryString}, {'model': queryString}, {'car_type': queryString}, {'size_and_price.size': queryString}]
		};
		page_heading = "Tuloksia hakusanalle \""+req.query.search+"\"";
	}
}
module.exports.getTyresPage = (req, res, next) => {
	setQueryObj(req, res, next);
	Tyre.find(queryObj).sort({"size_and_price.unit_price": 1}).exec((err, tyres) => {
		if(err || !tyres) {
			req.flash("error", "Ups! Valitettavasti emme voineet hakea yhtään rengasta tietokannasta.");
			return res.redirect("/");
		} else {
			res.render("tyres/tyres.ejs", {
				tyres: tyres,
				page_heading: page_heading,
				size: size,
				manufacturer: manufacturer,
				car_type: car_type
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
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};