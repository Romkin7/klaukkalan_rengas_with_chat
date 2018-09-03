"use strict";
const mongoose = require('mongoose');
const Order = require('../../../models/order');
let sortObj = {};
let queryObj = {};
let queryString = "";
function setQueryObj(req, res, next) {
	queryObj = {
		"status": "recieved"
	};
	sortObj = {};
	if(req.query && req.query.status) {
		queryObj = {
			"status": req.query.status
		};
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
		queryObj = {
			$or: [{'client.register_number': queryString}, {'name': queryString}]
		};
	}
};
module.exports.getOrders = (req, res, next) => {
	setQueryObj(req, res, next);
	Order.find(queryObj).sort({"createdAt": -1}).exec((err, orders) => {
		if(err || !orders) {
			req.flash("error", "Ups! Tilausten hakeminen epäonnistui!");
			return res.redirect("/admin");
		} else {
			res.render("admin/orders/allOrders.ejs", {
				orders: orders
			});
		}
	});
}; 
module.exports.showOrder = (req, res, next) => {
	Order
	.findById(req.params.id)
	.populate("services")
	.populate({path: "time", model: "Calendar"})
	.exec((err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Tilauksen hakeminen epäonnistui!");
			return res.redirect("/admin");
		} else {
			res.render("admin/orders/showOrder.ejs", {
				order: foundOrder
			});
		}
	});
};
// Mark as complete
module.exports.markAsComplete = (req, res, next) => {
	Order.findById(req.params.id, (err, foundOrder) => {
		if(err || !foundOrder) {
			req.flash("error", "Ups! Tapahtui virhe tilausta haettaessa!");
			return res.redirect("/admin/orders");
		} else {
			foundOrder.status = foundOrder.status === "done" ? "recieved" : "done";
			foundOrder.save((err, updatedOrder) => {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("/admin/orders");
				} else {
					req.flash("success", "Onnistui! Tilaukse tilaa on onnistuneesti päivitetty!");
					res.redirect("/admin/orders");
				}
			});
		}
	});
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};