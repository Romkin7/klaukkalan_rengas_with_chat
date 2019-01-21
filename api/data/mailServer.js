//Mail server setup and usage
"use strict";
const async = require('async');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
//Initialize sgTransport
const options = {
  auth: {
    api_user: process.env.SENDGRID_UNAME,
    api_key: process.env.SENDGRID_PW
  }
}
// module.exports.setServerdata = (req, res, next) => {
// 	serverdata.host = req.headers.host;
// 	serverdata.protocol = req.protocol;
// };
const mailer = nodemailer.createTransport(sgTransport(options));
//Export methods to send different emails
module.exports.notifyClientOnNewOrder = (req, res, order, times, next) => {
	var day = times[0].day.getDate() + "." + (times[0].day.getMonth()+1) + "." + times[0].day.getFullYear();
	async.series([
		function(cb) {
			let email = {
				from: 'RengasCenter Klaukkala - Klaukkalan Rengas <klaukkalanrengas@gmail.com>',
  				to: order.client.contact_information.email, // An array if you have multiple recipients.
  				subject: `Varausvahvistus rekisterinumerolle ${order.client.register_number}`,
  				html: `
  					<h1>Arvoisa ${ order.client.name.firstname } ${ order.client.name.lastname }, </h1>
					<p>Tämä on vahvistus siitä, että olette varanneet ajan online ajanvarauksen kautta.</p>
					<p>Valittu aika: ${day} klo: ${times[0].time}</p>
					<p>Työn kesto: ${order.total_duration}min</p>
					<p>Palvelut: </p>
					<p>${order.services[0].name}, ${ order.services[0].discounted_unit_price !== 0 ? order.services[0].discounted_unit_price+",00 €" : order.services[0].unit_price+",00 €" }</p>
					<p>Jos ette ole tehneet tätä varausta, olkaa hyvä ja ottakaa yhteyttä puhelimitse: <strong>+358 (0)50 591 73 22 </strong> tai sähköpostitse: <strong>klaukkalanrengas@gmail.com</strong>.</p>
					<p>Huom! Tämä on automaattinen viesti, älä vastaa tähän viestiin.</p>
					<p>Ystävällisin Terveisin, </p>
					<p>Klaukkalan Rengas </p>
					<p> https://klaukkalanrengas.fi</p>
				`
			};
 			mailer.sendMail(email, function(err, info) {
  				if (err) {
    				console.error(err);
  				} else {
    				console.log(info);
  				}
			});
			cb(null, "one");
		},
		function(cb) {
			let email = {
				from: 'RengasCenter Klaukkala - Klaukkalan Rengas <klaukkalanrengas@gmail.com>',
  				to: "klaukkalanrengas@gmail.com", // An array if you have multiple recipients.
  				subject: `Varausvahvistus rekisterinumerolle ${order.client.register_number}`,
  				html: `
  					<h1>Arvoisat ylläpitäjät,</h1>
					<p>Tämä on ilmoitus siitä, että ajanvaraus järjestelmään on luotu uusi ajanvaraus.</p>
					<p>Valittu aika: ${day} klo: ${times[0].time}</p>
					<p>Työn kesto: ${order.total_duration}min</p>
					<p>Palvelut: </p>
					<p>${order.services[0].name}, ${ order.services[0].discounted_unit_price !== 0 ? order.services[0].discounted_unit_price+",00 €" : order.services[0].unit_price+",00 €" }</p>
					<p>Varaajan nimi: ${order.client.name.firstname}, ${order.client.name.lastname}</p>
					<p>Voitte nähdä varauksen <a href="${req.protocol}://${req.headers.host}/admin/orders/${order._id}">täältä</a>.</p>
					<p>Ystävällisin Terveisin, </p>
					<p>Klaukkalan Rengas </p>
					<p> https://klaukkalanrengas.fi</p>
				`
			};
			mailer.sendMail(email, function(err, info) {
  				if (err) {
    				console.error(err);
  				} else {
    				console.log(info);
  				}
			});
			cb(null, "two");
		}
	],
	(err, results) => {
		console.log(results);
	});
};