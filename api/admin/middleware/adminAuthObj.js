"use strict";
const mongoose = require('mongoose');
const User = require('../../../models/user');
var adminAuthObj = {};
//middleware methods
adminAuthObj.isAdmin = (req, res, next) => {
	if(req.isAuthenticated() && req.user.admin.isAdmin) {
		return next();
	} else {
		req.flash("error", 'Vain Adminkäyttäjät ovat oikeutettuja tähän.');
		res.redirect("/");
	}
};
module.exports = adminAuthObj;