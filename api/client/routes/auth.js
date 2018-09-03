"use strict";
const express		= require('express');
const router 		= express.Router();
const authCtrl 		= require('../controllers/authCtrl');
const passport 		= require('passport');
const passportConf 	= require('../../config/passport');
// "/kirjaudu"
router
	.route("/kirjaudu-sisaan")
	.get(authCtrl.getSignInForm)
	.post(passport.authenticate('local', {
  		successRedirect: '/admin',
  		failureRedirect: '/kirjaudu-sisaan',
  		failureFlash: true
	}));
// "rekisteröidy"
router
	.route("/rekisteroidy")
	.get(authCtrl.getSignUpForm)
	.post(authCtrl.signUp);
// "/kirjaudu-ulos"
router
	.route("/kirjaudu-ulos")
	.get(authCtrl.signOut);
//Export router
module.exports = router;