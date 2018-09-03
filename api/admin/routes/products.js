"use strict";
const express = require('express');
const router = express.Router();
const productsCtrl = require('../controllers/productsCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
router
	.route('/')
	.get(adminAuthObj.isAdmin, productsCtrl.getTyres)
	.post(adminAuthObj.isAdmin, productsCtrl.addTyres);
router
	.route("/new")
	.get(adminAuthObj.isAdmin, productsCtrl.getAddProductForm);
router
	.route("/:id")
	.get(adminAuthObj.isAdmin, productsCtrl.getTyre)
	.put(adminAuthObj.isAdmin, productsCtrl.updateTyre)
	.patch(adminAuthObj.isAdmin, productsCtrl.updateTyreSizeAndPrice)
	.delete(adminAuthObj.isAdmin, productsCtrl.deleteTyre);
//send cropper data
router
	.route('/cropperdata')
	.post(productsCtrl.setCropperData);
module.exports = router;