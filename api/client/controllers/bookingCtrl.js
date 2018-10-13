"use strict";
const mongoose = require('mongoose');
const Service = require('../../../models/service');
const Calendar = require('../../../models/calendar');
const Cart = require('../../../models/cart');
const Order = require('../../../models/order');
const async = require('async');
const mailServer = require("../../data/mailServer");
//Helper functions
function capitalizeFirstLetter(string) {
	if(string !== "") {
		return string.trim().charAt(0).toUpperCase() + string.slice(1);
	} else {
		return "";
	}
};
//person constructor
function Person(firstname, lastname, email, phone, registernumber, street, index, city) {
	this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.phone = phone;
	this.registernumber = registernumber;
	this.street = street;
	this.index = index;
	this.city = city;
};
module.exports.renderTimebookingForm = (req, res, next) => {
	Cart.findById(req.params.id).populate("items").sort({"category": 1}).exec((err, foundCart) => {
    	if(err || !foundCart) {
      		req.flash("error", "Ups! Ostoskoria ei voitu löytää!");
      		return res.redirect("/");
    	} else {
    		res.render('booking/booking.ejs', {
    			cart: foundCart
    		});
    	}
  	});
};
module.exports.bookTime = (req, res, next) => {
	
};
module.exports.getCalendar = async (req, res, next) => {
	if(req.xhr) {
		const times = await Calendar.find({"day": req.query.day+"T00:00:00.000Z"}).sort({"time": 1});
		return res.status(200).json({
			times: times
		});
	} else {
		const cart = await Cart.findById(req.params.id).populate("items").sort({"category": 1});
		var today = new Date();
		var year = today.getFullYear();
		var month =today.getMonth() === 0 ? "01" : today.getMonth() === 1 ? "02" : today.getMonth() === 2 ? "03" : today.getMonth() === 3 ? "04" : today.getMonth() === 4 ? "05" : today.getMonth() === 5 ? "06" : today.getMonth() === 6 ? "07" : today.getMonth() === 7 ? "08" : today.getMonth() === 8 ? "09" : today.getMonth() === 9 ? "10" : today.getMonth() === 10 ? "11" : "12";
		var day = today.getDate() < 10 ? 0+''+today.getDate() : today.getDate();
		var	readyToday = year+"-"+month+"-"+day+'T00:00:00.000Z';
		const times = await Calendar.find({"day": readyToday }).sort({"time": 1})
		res.render("booking/dayAndTimeSelection.ejs", {
			times: times,
			cart: cart
		});
	}
};
module.exports.bookDate = async (req, res, next) => {
	const cart = await Cart.findById(req.params.id);
	const time = await Calendar.findById(req.body.id);
	if(cart.total_duration > 1) {
		//const times = Calendar.find({""})
	}
	Cart.findById(req.params.id, (err, foundCart) => {
		if(err || !foundCart) {
			return res.status(404).json({
				message: "Ups! Ostoskoria ei löytynyt.",
				error: "Tietonkanta virhe."
			});
		} else {
			Calendar.findById(req.body.id, (err, foundTime) => {
				if(foundTime.taken) {
					return res.status(500).json({
						message: "Ups! Valitsemanne aika on varattu.",
						error: "Aika on jo varattu!"
					});
				}
				foundCart.time = foundTime;
				foundCart.save((err, updatedCart) => {
					if(err) {
						return res.status(500).json({
							message: "Ups! Jokin meni pieleen aikaa valittaessa.",
							error: err.message
						});
					} else {
						req.session.cart = updatedCart;
						res.status(200).json({
							message: "success",
							cart: updatedCart
						});
					}
				});
			});
		}
	});
};
module.exports.getBookForm = (req, res, next) => {
	Cart.findById(req.params.id).populate("items").populate({path: "time", model: "Calendar"}).populate("time").exec((err, foundCart) => {
		if(err || !foundCart) {
			return res.status(404).json({
				message: "Ups! Ostoskoria ei löytynyt.",
				error: "Tietonkanta virhe."
			});
		} else if(foundCart.time && foundCart.time.taken) {
			req.flash("error", "Ups! Aika on ehditty varata, olkaa hyvä ja valitkaa toinen aika.");
			return res.redirect("/ajanvaraus/"+foundCart._id+"/ajankohta");
		} else {
			res.render("booking/booking_form.ejs", {
				cart: foundCart
			});
		}
	});
};
module.exports.getFormInformation = (req, res, next) => {
	var firstname = capitalizeFirstLetter(req.body.firstname);
	var lastname = capitalizeFirstLetter(req.body.lastname);
	var phone = String(req.body.phone).trim();
	var email = req.body.email;
	var registernumber = req.body.registernumber;
	var street = req.body.street || "";
	var index = req.body.index || "";
	var city = req.body.city || "";
	var person = new Person(firstname, lastname, email, phone, registernumber, street, index, city);
	Cart.findById(req.params.id).populate("items").populate({path: "time", model: "Calendar"}).exec((err, foundCart) => {
		if(err || !foundCart) {
			return res.status(404).json({
				message: "Ups! Ostoskoria ei löytynyt.",
				error: "Tietonkanta virhe."
			});
		} else {
			Calendar.findById(foundCart.time.id, (err, foundTime) => {
				if(err || !foundTime) {
					req.flash("error", "Ups! Valitettavasti hakemaanne aikaa ei voitu lisätä tietokantavirheen vuoksi. Yrittäkää hetken kuluttua uudelleen!");
					return res.redirect("/ajanvaraus/"+foundCart.id+"/henkilotiedot");
				} else if(foundTime.taken) {
					req.flash("error", "Ups! Aika on ehditty varata, olkaa hyvät ja valitkaa toinen aika.");
					return res.redirect("/ajanvaraus/"+foundCart.id+"/henkilotiedot");
				} else {
					foundTime.taken = true;
					foundTime.save((err, updatedTime) => {
						if(err) {
							req.flash("error", err.message);
							return res.redirect("/ajanvaraus/"+foundCart.id+"/henkilotiedot");
						} else {
							let order = new Order();
							order.client.name.firstname = person.firstname;
							order.client.name.lastname = person.lastname;
							order.client.address.street = person.street;
							order.client.address.index = person.index;
							order.client.address.city = person.city;
							order.client.contact_information.phone = person.phone;
							order.client.contact_information.email = person.email;
							order.client.register_number = person.registernumber;
							order.time = updatedTime;
							var count = 0;
							foundCart.items.forEach((item) => {
								order.services.push(item);
								count++;
							});
							if(count === foundCart.items.length) {
								order.save((err, newOrder) => {
									if(err) {
										req.flash("error", err.message);
										return res.redirect("/ajanvaraus/"+foundCart.id+"/henkilotiedot");
									} else {
										foundCart.time = {};
										foundCart.items = [];
										foundCart.total = 0;
										foundCart.total_price_excluding_tax = 0;
										foundCart.total_tax_amount = 0;
										foundCart.total_price_including_tax = 0;
										foundCart.total_price = 0;
										foundCart.save((err, updatedCart) => {
											if(err) {
												req.flash("error", err.message);
												return res.redirect("/ajanvaraus/"+foundCart.id+"/henkilotiedot");
											} else {
												mailServer.notifyClientOnNewOrder(req, res, newOrder, next);
												req.session.cart = updatedCart;
												res.render("booking/confirmation.ejs", {
													order: newOrder
												});
											}
										})
									}
								});
							}
						}
					});
				}
			});
		}
	});
};
// xhr methods
module.exports.getTyreHotelData = (req, res, next) => {
	Service.find({"category": "tyrehotel", "tyre_size": Number(req.query.tyre_size)}).sort({"name": 1}).exec((err, services) => {
		if(err || !services) {
			return res.status(404).json({
				message: "Ups! Yhtään Rengashotelli palvelua ei voitu löytää."
			});
		} else {
			res.status(200).json({
				services: services
			});
		}
	});
};
module.exports.getTyreServicesData = (req, res, next) => {
	async.parallel([
		function(cb) {
			Service.find({"category": "maintainance", "tyre_size": req.query.tyre_size}).sort({"name": 1}).exec((err, services1) => {
				if(err || !services1) {
					return cb(null);
				} else {
					cb(null, services1)
				}
			});
		},
		function(cb) {
			Service.find({"category": "maintainance", "tyre_size": 0}).sort({"name": 1}).exec((err, services2) => {
				if(err || !services2) {
					return cb(null);
				} else {
					cb(null, services2)
				}
			});
		}
	], function(err, allServices){
		if(err) {
			return res.status(404).json({
				error: "Ups! Yhtään Rengaspalvelua ei löytynyt."
			});
		} else {
			let arr1 = allServices[0];
			let arr2 = allServices[1];
			let finalAllServices = (arr1.concat(arr2));
			res.status(200).json({
				services: finalAllServices
			});
		}
	});
};
module.exports.getTyreWashData = (req, res, next) => {
	Service.find({"category": "wash"}).sort({"name": 1}).exec((err, services) => {
		if(err || !services) {
			return res.status(404).json({
				message: "Ups! Yhtään Rengashotelli palvelua ei voitu löytää."
			});
		} else {
			res.status(200).json({
				services: services
			});
		}
	});
};
//Check cart items
module.exports.checkCartItems = (req, res, next) => {
	Cart.findById(req.params.id, (err, foundCart) => {
		if(err || !foundCart) {
			return res.status(404).json("error");
		} else {
			res.status(200).json(foundCart);
		}
	});
};