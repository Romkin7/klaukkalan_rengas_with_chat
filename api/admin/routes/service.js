"use strict";
const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceCtrl');
const adminAuthObj = require('../middleware/adminAuthObj');
router
	.route('/')
	.get(adminAuthObj.isAdmin, serviceCtrl.getServices)
	.post(adminAuthObj.isAdmin, serviceCtrl.postService);
router
	.route('/add')
	.get(adminAuthObj.isAdmin, serviceCtrl.getAddServiceForm);
//routes to get one service, update it or delete it
router
	.route("/:id")
	.get(adminAuthObj.isAdmin, serviceCtrl.getService)
	.put(adminAuthObj.isAdmin, serviceCtrl.updateService)
	.delete(adminAuthObj.isAdmin, serviceCtrl.deleteService);
module.exports = router;