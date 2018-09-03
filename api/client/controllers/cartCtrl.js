"use strict";
const mongoose = require('mongoose');
const Cart = require('../../../models/cart');
const Service = require('../../../models/service');
const Calendar = require('../../../models/calendar');

module.exports.addToCart = (req, res, next) => {
	Cart.findById(req.params.id, (err, foundCart) => {
		if(err || !foundCart) {
			return res.status(500).json({
				message: "Ups! Valitettavasti osotoskoria ei voitu löytää.",
				error: err.message
			});
		} else {
			Service.findById(req.body.id, (err, foundService) => {
				if(err || !foundService) {
					return res.status(500).json({
						message: "Ups! Valitettavasti hakemaanne palvelua ei voitu löytää.",
						error: err.message
					})
				} else {
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
					} if(req.body.method === "remove") {
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
      								if(err || !foundCart) {
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
				}
			});
		}
	});
};