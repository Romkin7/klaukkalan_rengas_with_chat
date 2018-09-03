"use strict";
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../../models/user');
// "/kirjudu-sisään" methods
// get sign In Form
module.exports.getSignInForm = (req, res, next) => {
	res.render("auth/signin.ejs");
};
// "/rekisteroidy" methods
// get sign in form
module.exports.getSignUpForm = (req, res, next) => {
	res.render("auth/signup.ejs");
};
// sign in
module.exports.signUp = (req, res, next) => {
	User.create({
		email: req.body.email,
		name: {
			firstname: req.body.firstname,
			lastname: req.body.lastname
		},
		password: req.body.password
	}, (err, newUser) => {
		if(err) {
			req.flash("error", err.mesage);
			return res.redirect("/rekisteroidy");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Tervetuloa Klaukkalan rengas hotelliin!");
           		res.redirect("/");
			});
		}
	});
};
// "/kirjaudu-ulos" methods
// sign out
module.exports.signOut = (req, res, next) => {
	req.logout();
	req.flash("success", "Kiitos käynnistä, tervetuloa uudelleen!");
	res.redirect("/");
};