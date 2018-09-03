"use strict";
const express = require('express');
const router = express.Router();
const ordersCtrl = require('../controllers/ordersCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
router
	.route('/')
	.get(adminAuthObj.isAdmin, ordersCtrl.getOrders);
router
	.route("/:id")
	.get(adminAuthObj.isAdmin, ordersCtrl.showOrder)
	.patch(adminAuthObj.isAdmin, ordersCtrl.markAsComplete);
module.exports = router;