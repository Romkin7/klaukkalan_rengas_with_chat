"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Service = require('../../models/service');
const Cart = require('../../models/cart');
const Calendar = require('../../models/calendar');
const Order = require('../../models/order');
const mailServer = require("../../api/data/mailServer");
//Helper functions
function capitalizeFirstLetter(string) {
	if(string !== "") {
		return string.trim().charAt(0).toUpperCase() + string.slice(1);
	} else {
		return "";
	}
};

async function updateTimes() {
	const times = await Calendar.find();
	const updatedTimes = times.map(async (time) => {
		if(time.quantity === 3 || time.quantity === 2 || time.quantity === 1) {
			time.quantity = 1;
			const updatedTime = await time.save();
			return updatedTime;
		} else {
			time.quantity = 0;
			const updatedTime = await time.save();
			return updatedTime;
		}
	});
	console.log(updatedTimes);
}
updateTimes();
//person constructor
class Person {
	constructor(firstname, lastname, email, phone, registernumber, street, index, city) {
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.phone = phone;
		this.registernumber = registernumber;
		this.street = street;
		this.index = index;
		this.city = city;
	}
};
/*get booking page*/
router.get("/:id", async (req, res, next) => {
	let washServices = await Service.find({"category": "wash"}).sort({"name": 1});
	let tyreHotelServices = await Service.find({"category": "tyrehotel"}).sort({"name": 1});
	let maintainanceServices = await Service.find({"category": "maintainance"}).sort({"name": 1});
	let cart = await Cart.findById(req.params.id).populate("items").sort({"category": 1});
	res.render("booking/booking.ejs", {
		washServices: washServices,
		tyreHotelServices: tyreHotelServices,
		maintainanceServices: maintainanceServices,
		cart: cart
	});
});
/*add to cart */
router.patch("/:id", async (req, res, next) => {
	let foundCart = await Cart.findById(req.params.id);
	let foundService = await Service.findById(req.body.id);
	if(req.body.method === "add") {
		foundCart.total_price_including_tax = (foundCart.total_price_including_tax + Number(req.body.total_price));
  		foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax + parseFloat(req.body.total_unit_price_excluding_tax)).toFixed(2);
  		foundCart.total_tax_amount = (foundCart.total_tax_amount + parseFloat(req.body.total_tax_amount)).toFixed(2);
  		foundCart.items.push(foundService);
  		foundCart.total = (foundCart.total + Number(req.body.total_quantity));
  		foundCart.save((err, updatedCart) => {
  			if(err) {
  				return res.status(500).json({
  					message: "Ups! Odottamaton virhe tapahtui ostoskoria päivittäessä.",
  					error: err.messge
  				});
  			} else {
  				Cart.findById(updatedCart.id).populate("items").exec((err, foundUpdatedCart) => {
  					if(err || !foundUpdatedCart) {
  						return res.status(500).json({
							message: "Ups! Valitettavasti osotoskoria ei voitu löytää.",
							error: err.message
						});
  					} else {
  						req.session.cart = foundUpdatedCart;
  						res.status(201).json({
  							message: "success",
  							cart: foundUpdatedCart
  						});
  					}
  				});
  			}
  		});
	} else if(req.body.method === "remove") {
		foundCart.total_price_including_tax = (foundCart.total_price_including_tax !== 0 ? foundCart.total_price_including_tax - Number(req.body.total_price) : 0);
  		foundCart.total_price_excluding_tax = (foundCart.total_price_excluding_tax !== 0 ? foundCart.total_price_excluding_tax - parseFloat(req.body.total_unit_price_excluding_tax).toFixed(2) : 0);
  		foundCart.total_tax_amount = (foundCart.total_tax_amount - parseFloat(req.body.total_tax_amount)).toFixed(2);
  		foundCart.items.pull(req.body.id);
  		foundCart.total = (foundCart.total - Number(req.body.total_quantity));
  		foundCart.save((err, updatedCart) => {
  			if(err) {
  				return res.status(500).json({
  					message: "Ups! Odottamaton virhe tapahtui ostoskoria päivittäessä.",
  					error: err.messge
  				});
  			} else {
  				Cart.findById(updatedCart.id).populate("items").exec((err, foundUpdatedCart) => {
  					if(err || !foundUpdatedCart) {
  						res.status(500).json({
  							message: "Ups! Valitettavasti osotoskoria ei voitu löytää.",
  							error: "Tietokanta virhe."
  						});
  					} else {
                    	req.session.cart = foundUpdatedCart;
  						res.status(201).json({
  							message: "success",
  							cart: foundUpdatedCart
  						});
  					}
  				});
  			}
  		});
	}
});
router.get("/:id/tarkista_palvelut", async(req, res, next) => {
	let cart = await Cart.findById(req.params.id);
	if(!cart) {
		return res.status(404).json("error");
	} else {
		res.status(200).json(cart);
	}
});
router.get("/:id/tarkista_ajat", async(req, res, next) => {
	let timeIds = await req.session.times ? req.session.times.map((time) => {return time._id}) : [];
	let times = await Calendar.find({"_id": { $in: timeIds}, "taken": false});
	if(!times) {
		return res.status(404).json("error");
	} else {
		res.status(200).json(times);
	}
});
router.get('/:id/ajankohta', async(req, res, next) => {
	if(req.xhr) {
		const times = await Calendar.find({"day": req.query.day+" 00:00:00.000Z"}).sort({"time": 1});
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
		const times = await Calendar.find({"day": readyToday }).sort({"time": 1});
		res.render("booking/dayAndTimeSelection.ejs", {
			times: times,
			cart: cart
		});
	}
});
router.patch("/:id/kesto", async(req, res, next) => {
	const duration = parseInt(req.body.duration) / 10;
	let count = 0;
	let curId = Number(req.body.id);
	if(duration === 1 || req.body.hour === "17:00") {
		let time = await Calendar.findById(req.body.id);
		let times = [];
		times = [];
		times.push(time);
		req.session.times = times;
		return res.status(200).json(times);
	} else {
		let times = await Calendar.find({}).sort({"_id": 1}).skip(curId-1).limit(duration);
		req.session.times = times;
		return res.status(200).json(times);
	}
});
router.put("/:id/ajankohta", async(req, res, next) => {
	let cart = await Cart.findById(req.params.id);
	let timeIds = await req.session.times.map((time) => {return time._id});
	let times = await Calendar.find({"_id": { $in: timeIds}, "taken": false});
	if(timeIds.length !== times.length) {
		return res.status(400).json({
			"message": "Valitettavasti valitsemanne aika on ehditty varata hetki sitten, olkaa hyvä ja valitkaa toinen aika."
		});
	} else {
		cart.times = [];
		for(var i = 0; i < times.length; i++) {
			cart.times.push(times[i]._id);
		};
		const updatedCart = await cart.save();
		req.session.cart = updatedCart;
		return res.status(200).json(times);
	}
});
router.get("/:id/henkilotiedot", async(req, res, next) => {
	let cart = await Cart.findById(req.params.id).populate("items");
	let times = await Calendar.find({"_id": { $in: cart.times}, "taken": false});
	if(!cart) {
		return res.status(404).json({
			message: "Ups! Ostoskoria ei löytynyt.",
			error: "Tietonkanta virhe."
		});
	} else if(times && times.length !== cart.times.length) {
		req.flash("error", "Ups! Aika on ehditty varata, olkaa hyvä ja valitkaa toinen aika.");
		return res.redirect("/ajanvaraus/"+foundCart._id+"/ajankohta");
	} else {
		res.render("booking/booking_form.ejs", {
			cart: cart,
			times: times
		});
	}
});
router.post("/:id/henkilotiedot", async(req, res, next) => {
	let foundCart = await Cart.findById(req.params.id).populate("items");
	if(!foundCart) {
		return res.status(404).json({
			message: "Ups! Ostoskoria ei löytynyt.",
			error: "Tietonkanta virhe."
		});
	}
	let times = await Calendar.find({"_id": {$in: foundCart.times}, "taken": false});
	let updatedTimes = await times.map((time) => {
		Calendar.findById(time._id, (err, foundTime) => {
			if(err || !foundTime) {
				return res.status(500).json(err);
			} else {
				foundTime.quantity = Number(foundTime.quantity) !== 0 ? Number(foundTime.quantity) - 1 : Number(foundTime.quantity) = 0;
				if(foundTime.quantity === 0) {
					foundTime.taken = true;
				}
				foundTime.save((err, updatedTime) => {
					if(err) {
						return res.status(500).json(err);
					} else {
						return foundTime;
					}
				});
			}
		});
	});
	var firstname = capitalizeFirstLetter(req.body.firstname);
	var lastname = capitalizeFirstLetter(req.body.lastname);
	var phone = String(req.body.phone).trim();
	var email = req.body.email;
	var registernumber = req.body.registernumber;
	var street = req.body.street || "";
	var index = req.body.index || "";
	var city = req.body.city || "";
	var person = await new Person(firstname, lastname, email, phone, registernumber, street, index, city);
	let order = new Order();
	order.client.name.firstname = person.firstname;
	order.client.name.lastname = person.lastname;
	order.client.address.street = person.street;
	order.client.address.index = person.index;
	order.client.address.city = person.city;
	order.client.contact_information.phone = person.phone;
	order.client.contact_information.email = person.email;
	order.client.register_number = person.registernumber;
	order.times = foundCart.times;
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
				foundCart.times = [];
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
						mailServer.notifyClientOnNewOrder(req, res, newOrder, times, next);
						req.session.cart = updatedCart;
						req.session.times = [];
						res.render("booking/confirmation.ejs", {
							order: newOrder,
							times: times
						});
					}
				});
			}
		});
	}
});
module.exports = router;