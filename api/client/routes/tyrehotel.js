"use strict";
const express = require('express');
const router = express.Router();
const tyreHotelCtrl = require('../controllers/tyreHotelCtrl');
// "/tyrehotel" routes
router
	.route("/")
	.get(tyreHotelCtrl.getTyreHotel);
module.exports = router;
