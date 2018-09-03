"use strict";
const express = require('express');
const router = express.Router();
const tyreCtrl = require('../controllers/tyreCtrl');
// "/renkaat/vanteet"
router
	.route('/vanteet')
	.get(tyreCtrl.getDisksPage);
// "/renkaat/rengaspaketit"
router
	.route("/rengaspaketit")
	.get(tyreCtrl.getTyrePackagePage);
// "/renkaat"
router
	.route('/')
	.get(tyreCtrl.getTyresPage);
router
	.route('/:id')
	.get(tyreCtrl.getTyre);
//Module exports router
module.exports = router;