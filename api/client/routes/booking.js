"use strict";
const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controllers/bookingCtrl');
const cartCtrl = require('../controllers/cartCtrl');
// "/" routes and it's methods
router
  .route("/:id")
  .get(bookingCtrl.renderTimebookingForm)
  .post(bookingCtrl.bookTime)
  .patch(cartCtrl.addToCart);
 //check for cart items
 router
 	.route("/:id/tarkista")
 	.get(bookingCtrl.checkCartItems);
// "/date"
router
	.route('/:id/ajankohta')
	.get(bookingCtrl.getCalendar)
	.patch(bookingCtrl.bookDate);
// "/date"
router
	.route('/:id/henkilotiedot')
	.get(bookingCtrl.getBookForm)
	.post(bookingCtrl.getFormInformation);
//xhr request routes
// TyreServices route
router
	.route("/:id/tyreservices")
	.get(bookingCtrl.getTyreServicesData);
//TyreHotel routes
router
	.route("/:id/tyrehotel")
	.get(bookingCtrl.getTyreHotelData);
//TyreWash routes
router
	.route("/:id/tyrewash")
	.get(bookingCtrl.getTyreWashData);
//Export router
module.exports = router;
