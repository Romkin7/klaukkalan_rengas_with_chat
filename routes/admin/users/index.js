"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../../models/user');
const paginate = require("../../../middleware/paginate");
const adminAuthObj = require('../../../api/admin/middleware/adminAuthObj');
router.get("/", adminAuthObj.isAdmin, async (req, res, next) => {
	let userCount = User.count({});
	paginate.paginateItems(req, res, User, "user", function(users) {
		console.log(users.output.data);
		res.render("admin/users/list", {
			count: userCount,
			users: users.output.data,
			pages: users.output.pages,
			title: users.page_heading,
			total: users.output.items
		});
	});
});
module.exports = router;