"use strict";
const express = require('express');
const router = express.Router();
const CacheControl = require("express-cache-control");
const cache = new CacheControl().middleware;
const indexCtrl = require('../controllers/indexCtrl');
// "/" routes and it's methods
router
  .route("/")
  .get(cache("hours", 3), indexCtrl.renderLandingPage);
// "/location"
router
	.route('/sijainti')
	.get(cache("hours", 3), indexCtrl.getLocationPage);
router
	.route("/evasteet")
	.get(cache("hours", 3), indexCtrl.cookies);
router
	.route("/tietosuojakaytanto")
	.get(cache("hours", 3), indexCtrl.getGdrp);
//Export router
module.exports = router;
