"use strict";
const mongoose = require('mongoose');
const Service = require('../../../models/service');
const async = require('async');
let output = {
	hotelServices: [],
	maintainanceServices: [],
	washServices: []
};
module.exports.getPriceList = (req, res, next) => {
	if(req.query && req.query.name) {
		Service.find({"name": req.query.name}).sort({"unit_price": 1}).exec((err, services) => {
			if(err || !services) {
				req.flash("error", "Palveluita ei löytynyt tietokannasta teknisen vian vuoksi.");
				return res.redirect("back");
			} else {
				res.render("prices/pricelist.ejs", {
					tyreServices: services,
					tyreHotelServices: [],
					tyreWashServices: []
				});
			}
		});
	} else {
		output = {
			hotelServices: [],
			maintainanceServices: [],
			washServices: []
		};
		async.parallel([
			function(cb) {
				Service.find({"category": "tyrehotel"}).sort({"unit_price": 1}).exec((err, hotelServices) => {
					if(err || !hotelServices) {
						req.flash("error", "Palveluita ei löytynyt tietokannasta teknisen vian vuoksi.");
						return res.redirect("back");
					} else {
						output.hotelServices = hotelServices;
						cb(null, hotelServices);
					}
				});
			},
			function(cb) {
				Service.find({"category": "maintainance"}).sort({"filter_name": 1, "name": 1, "tyre_size": 1}).exec((err, maintainanceServices) => {
					if(err || !maintainanceServices) {
						req.flash("error", "Palveluita ei löytynyt tietokannasta teknisen vian vuoksi.");
						return res.redirect("back");
					} else {
						output.maintainanceServices = maintainanceServices;
						cb(null, maintainanceServices);
					}
				});
			},				
			function(cb) {
				Service.find({"category": "wash"}).sort({"name": 1}).exec((err, washServices) => {
					if(err || !washServices) {
						req.flash("error", "Palveluita ei löytynyt tietokannasta teknisen vian vuoksi.");
						return res.redirect("back");
					} else {
						output.washServices = washServices;
						cb(null, washServices);
					}
				});
			}
		], function done(err, results) {
			if(err) {
				res.json(err.message);
			} else {
				res.render("prices/pricelist.ejs", {
					tyreServices: output.maintainanceServices,
					tyreHotelServices: output.hotelServices,
					tyreWashServices: output.washServices
				});
			}
		});
	}
};