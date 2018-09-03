"use strict";
const express  		= require('express');
const router  		= express.Router();
const priceListCtrl = require('../controllers/priceListCtrl');
// "/prices"
router
	.route('/')
	.get(priceListCtrl.getPriceList);
//Export router
module.exports = router;
