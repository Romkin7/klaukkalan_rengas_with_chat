"use strict";
const mongoose = require('mongoose');
const Service = require('../../../models/service');
const async = require('async');
let output = {
	hotelServices: [],
	maintainanceServices: [],
	washServices: []
};
module.exports.getServices = (req, res, next) => {
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
			res.render("admin/services/view.ejs", {
				tyreServices: output.maintainanceServices,
				tyreHotelServices: output.hotelServices,
				tyreWashServices: output.washServices
			});
		}
	});
};
module.exports.getAddServiceForm = (req, res, next) => {
	res.render("admin/services/add.ejs");
};
module.exports.postService = (req, res, next) => {
	var tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
	var discountedTax = Number(req.body.discounted_unit_price) !== 0 ? ((parseInt(req.body.discounted_unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100) : 0;
	var service = {
		name: req.body.name.trim(),
		type: req.body.type.trim(),
		vat: parseFloat(req.body.vat).toFixed(2),
		unit_price: Number(req.body.unit_price),
		tax: tax,
		discounted_tax: discountedTax,
  		unit_price_excluding_tax: (parseInt(req.body.unit_price) - tax).toFixed(2),
  		discounted_unit_price: Number(req.body.discounted_unit_price),
  		discounted_unit_price_excluding_taxes: Number(req.body.discounted_unit_price) !== 0 ? (parseInt(req.body.discounted_unit_price) - tax).toFixed(2) : 0,
		tyre_size: parseInt(req.body.tyre_size),
		additional_info: req.body.additional_info !== "" ? req.body.additional_info.trim() : "",
		category: req.body.category.trim(),
		duration: req.body.duration
	};
	Service.create(service, (err, newService) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/admin/service/add");
		} else {
			req.flash("success", "Onnistui! Rengaspalvelu on onnistuneesti luotu tietokantaan!");
			res.redirect("/admin/services/add");
		}
	});
};
// methods fo /admin/service/:id
module.exports.getService = (req, res, next) => {
	Service.findById(req.params.id, (err, foundService) => {
		if(err || !foundService) {
			req.flash("error", "Ups! Jokin meni pieleen rengaspalvelua haettaessa tietokannasta!");
			return res.redirect("/admin/services");
		} else {
			res.render("admin/services/show.ejs", {
				service: foundService
			});
		}
	});
};
module.exports.updateService = (req, res, next) => {
	Service.findById(req.params.id, (err, foundService) => {
		if(err || !foundService) {
			req.flash("error", "Ups! Tapahtui virhe rengaspalvelua haettaessa tietokannasta.");
			return res.redirect("/admin/services");
		} else {
			var tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
			var discountedTax = Number(req.body.discounted_unit_price) !== 0 ? ((parseInt(req.body.discounted_unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100) : 0;
			foundService.name = req.body.name.trim();
			foundService.type = req.body.type.trim();
			foundService.vat = parseFloat(req.body.vat).toFixed(2);
			foundService.unit_price = Number(req.body.unit_price);
			foundService.tax = tax;
			foundService.duration = req.body.duration;
			foundService.discounted_tax = discountedTax;
  			foundService.unit_price_excluding_tax = (parseInt(req.body.unit_price) - tax).toFixed(2);
  			foundService.discounted_unit_price = Number(req.body.discounted_unit_price);
  			foundService.discounted_unit_price_excluding_taxes = Number(req.body.discounted_unit_price) !== 0 ? (parseInt(req.body.discounted_unit_price) - tax).toFixed(2) : 0;
			foundService.tyre_size = parseInt(req.body.tyre_size);
			foundService.additional_info = req.body.additional_info !== "" ? req.body.additional_info.trim() : "";
			foundService.category = req.body.category.trim();
			foundService.time_cost = req.body.time_cost;
			foundService.save((err, updatedService) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/services/"+req.params.id);
				} else {
					req.flash("success", "Onnistui! Rengaspalvelun tietoja on onnistuneesti päivitetty!");
					res.redirect("/admin/services/"+req.params.id);
				}
			});
		}
	});
};
module.exports.deleteService = (req, res, next) => {
	Service.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect("/admin/services");
		} else {
			req.flash("success", "Onnistui! Rengaspalvelu on onnistuneesti poistettu tietokannasta!");
			res.redirect("/admin/services");
		}
	});	
};