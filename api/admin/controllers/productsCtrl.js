"use strict";
const mongoose 		= require('mongoose');
const Tyre 			= require('../../../models/tyre');
const multer 		= require("multer");
const cloudinary 	= require('cloudinary');
const fs 			= require('fs');
const fileType 		= require('file-type');
const readChunk		= require('read-chunk');
const jimp			= require('jimp');
//Add product
//Variables to hold temporary data to create product
let cropperData;
let featuredImg;
let featuredMinImg;
const manufacturers = [
	"Nokian Renkaat", 
	"Nokian Nordman", 
	"Continental", 
	"Nexen",
	"Bridgestone",
	"Toyo",
	"Nordexx",
	"Sava",
	"Goodyear"
];
let manufacturer = "Kaikki";
let car_type = "";
let queryObj = {};
let queryString = "";
let size= "";
let page_heading = "RengasCenter Klaukkala - Renkaat Klaukkala";
function setQueryObj(req, res, next) {
	queryObj = {};
	size = "";
	manufacturer = req.query.manufacturer !== undefined ? req.query.manufacturer : req.query.manufacturer === "Kaikki" ? "Kaikki" : "Kaikki";
	car_type = req.query.car_type !== undefined ? req.query.car_type : "";
	page_heading = "RengasCenter Klaukkala - Renkaat Klaukkala";
	queryObj = {
		"category": "Kesärenkaat",
		"car_type": req.query.car_type !== undefined ? req.query.car_type : "Henkilöauto",
		"manufacturer": req.query.manufacturer === "Kaikki" ? {$in: manufacturers} : req.query.manufacturer === undefined ? {$in: manufacturers} : req.query.manufacturer
	};
	if(req.query && req.query.size) {
		queryObj = {
		"category": "Kesärenkaat",
		"car_type": req.query.car_type !== undefined ? req.query.car_type : "Henkilöauto",
		"manufacturer": req.query.manufacturer === "Kaikki" ? {$in: manufacturers} : req.query.manufacturer === undefined ? {$in: manufacturers} : req.query.manufacturer,
		"size_and_price.size": req.query.size
		};
		size = req.query.size;
		page_heading = "Kaikki renkaat "+req.query.cartype+" koolle \""+req.query.size+"\"";
	}
	if(req.query && req.query.search) {
		queryString = new RegExp(escapeRegex(req.query.search), "gi");
		queryObj = {
			$or: [{'manufacturer': queryString}, {'model': queryString}, {'car_type': queryString}, {'size_and_price.size': queryString}]
		};
		page_heading = "Tuloksia hakusanalle \""+req.query.search+"\"";
	}
};
function _splitArray(input){
	var output;
	if(input && input.length > 0) {
		output = input.split("!;");
	} else {
		output = [];
	}
	return output;
};
//Setup multer
//Create new file-Upload System
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
  	var fileExtension = file.originalname.split('.')[1];
  	featuredImg = req.user.email.toLowerCase()+Date.now()+'.'+fileExtension;
    callback(null, featuredImg);
  }
});
var upload = multer({ storage : storage}).single('cover');
//Configure cloudinary
cloudinary.config({
	cloud_name: "klaukkalanrengas-fi",
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET
});
//Get cropper Data, presave it into variable
module.exports.setCropperData = (req, res, next) => {
	/***** GRAB DATA FROM AJAX *****/
	cropperData = req.body;
	if(cropperData !== undefined) {
		res.send('success');
	} else {
		res.send("error");
	}
};
module.exports.getTyres = (req, res, next) => {
	setQueryObj(req, res, next);
	Tyre.find(queryObj).sort({"size_and_price.unit_price": 1}).exec((err, tyres) => {
		if(err || !tyres) {
			req.flash("error", "Ups! Valitettavasti emme voineet hakea yhtään rengasta tietokannasta.");
			return res.redirect("/");
		} else {
			res.render("admin/products/listProducts.ejs", {
				tyres: tyres,
				page_heading: page_heading,
				size: size,
				manufacturer: manufacturer,
				car_type: car_type
			});
		}
	});
};
module.exports.getAddProductForm = (req, res, next) => {
	res.render("admin/products/createProduct.ejs");
};
module.exports.addTyres = (req, res, next) => {
	upload(req, res, (err) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect('/admin');
		} else {
			if(req.file) {
				const buffer = readChunk.sync(`./public/images/uploads/${featuredImg}`, 0, 4100);
				if(fileType(buffer) && fileType(buffer).mime === "image/png" || fileType(buffer).mime === "image/jpg" || fileType(buffer).mime === "image/jpeg" || fileType(buffer).mime === "image/bmp") {
					jimp.read(`./public/images/uploads/${featuredImg}`, (err, lenna)=> {
						if(err) {
							req.flash("error", err.message);
							return res.redirect('/admin');
						} else {
							if(lenna.bitmap.width > 289 && lenna.bitmap.height > 289) {
								var x = Number(cropperData.x);
								var y = Number(cropperData.y);
								var width = Number(cropperData.width);
								var height = Number(cropperData.height);
								var rotate = Number(cropperData.rotate);
								var scaleX = Number(cropperData.scaleX);
								var scaleY = Number(cropperData.scaleY);
								lenna.rotate(rotate).scale(scaleX).crop(x, y, width, height).quality(60)
								.resize(576, 576).write(`./public/images/cropped-images/${featuredImg}`, (err, croppedImg) => {
									if(err) {
										req.flash("error", err.message);
										res.redirect('back');
										return;
									} else {
										cloudinary.uploader.upload(`./public/images/cropped-images/${featuredImg}`, (result) => { 
											if(result) {
												var tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
												var size_and_price = {
													size: req.body.size,
													unit_price: Number(req.body.unit_price),
													tax: tax,
													unit_price_excluding_tax: (parseInt(req.body.unit_price) - tax).toFixed(2)
												};
												var newTyre = new Tyre();
												newTyre.type_of_product = req.body.type_of_product;
												newTyre.manufacturer = req.body.manufacturer;
												newTyre.model = req.body.model;
												newTyre.size_and_price.push(size_and_price);
												newTyre.car_type = req.body.car_type;
												newTyre.category = req.body.category;
												newTyre.additional_info = _splitArray(req.body.additional_info);
												newTyre.cover = result.secure_url;
												newTyre.cover_id = result.public_id;
												newTyre.save((err, tyre) => {
													if(err) {
														req.flash("error", err.message);
														return res.redirect("/admin");
													} else {
														req.flash("success", "Onnistui! Tuote "+tyre.title+" "+tyre.model+" on onnistunnesti luotu!");
														return res.redirect("/admin");
													}
												});
											} else {
												req.flash("error", "Lataus cloudinary pilvipalveluun epäonnistui.");
												return res.redirect('/admin');
											}
										});
									}
								});
							} else {
								req.flash("error", "Kuvatiedoston leveys ja korkeus on oltava vähintään 300px.");
								return res.redirect('/admin');
							}
						}
					});
				} else {
					req.flash("error", "Vain jpg, png, bmp ja jpeg kuvatiedostot ovat sallittuja.");
					return res.redirect('/admin');
				}
			} else {
				req.flash("error", "Valitkaa kuvatiedosto jatkaaksenne tuotteen luomista.");
				return res.redirect("/admin");
			}
		}
	});
};
// /:id router
module.exports.getTyre = (req, res, next) => {
	Tyre.findById(req.params.id, (err, foundTyre) => {
		if(err || !foundTyre) {
			req.flash("error", "Ups! Valitettavasti jokin meni pieleen rengasta haettaessa!");
			return res.redirect("/admin/products");
		} else {
			res.render("admin/products/editProduct.ejs", {
				tyre: foundTyre
			});
		}
	});
};
module.exports.updateTyre = (req, res, next) => {
	Tyre.findById(req.params.id, (err, foundTyre) => {
		if(err || !foundTyre) {
			req.flash("error", "Ups! Valitettavasti rengasta ei voitu hakea tietokannasta!");
			return res.redirect("/admin/products/"+req.params.id);
		} else {
			foundTyre.category = req.body.category;
			foundTyre.car_type = req.body.car_type;
			foundTyre.type_of_product = req.body.type_of_product;
			foundTyre.model = req.body.model;
			foundTyre.manufacturer = req.body.manufacturer;
			foundTyre.additional_info = _splitArray(req.body.additional_info);
			foundTyre.save((err, updatedTyre) => {
				if(err) {
					req.flash('error', err.message);
					return res.redirect("/admin/products/"+req.params.id);
				} else {
					req.flash("success", "Onnistui! Renkaan tietoja on onnistuneesti päivitetty!");
					res.redirect("/admin/products/"+req.params.id);
				}
			});
		}
	});
};
module.exports.updateTyreSizeAndPrice = (req, res, next) => {
	Tyre.findById(req.params.id, (err, foundTyre) => {
		if(err || !foundTyre) {
			req.flash("error", "Ups! Jokin meni pieleen rengasta haettaessa.");
			return res.redirect("/admin/products/"+req.params.id);
		} else {
			if(req.body._id) {
				foundTyre.size_and_price.pull({_id: req.body._id});
				let sizeAndPrice = {};
				let tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
				sizeAndPrice.size = req.body.size;
				sizeAndPrice.unit_price = req.body.unit_price;
				sizeAndPrice.tax = tax;
				sizeAndPrice.unit_price_excluding_tax = (parseInt(req.body.unit_price) - tax).toFixed(2);
				foundTyre.size_and_price.unshift(sizeAndPrice);
				foundTyre.save((err, updatedTyre) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/products/"+req.params.id);
					} else {
						req.flash("success", "Onnistui! Koko ja hita tietoja on onnistuneesti päivitetty koolle "+req.body.size);
						return res.redirect("/admin/products/"+req.params.id);
					}
					return;
				});
			} else {
				let sizeAndPrice = {};
				let tax = ((parseInt(req.body.unit_price) * (parseFloat(req.body.vat).toFixed(2) * 100)) / 100);
				sizeAndPrice.size = req.body.size;
				sizeAndPrice.unit_price = req.body.unit_price;
				sizeAndPrice.tax = tax;
				sizeAndPrice.unit_price_excluding_tax = (parseInt(req.body.unit_price) - tax).toFixed(2);
				foundTyre.size_and_price.unshift(sizeAndPrice);
				foundTyre.save((err, updatedTyre) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/products/"+req.params.id);
					} else {
						req.flash("success", "Onnistui! Koko ja hita tietoja on onnistuneesti päivitetty koolle "+req.body.size);
						return res.redirect("/admin/products/"+req.params.id);
					}
				});
			}
		}
	})
};
module.exports.deleteTyre = (req, res, next) => {
	Tyre.findById(req.params.id, (err, foundTyre) => {
		cloudinary.uploader.destroy(foundTyre.cover_id, (result) => {
			if(result.result === "not found") {
				return res.send("error");
			} else {
				foundTyre.remove((err) => {
					if(err) {
						req.flash("error", err.message);
						return res.redirect("/admin/products");
					} else {
						req.flash("success", "Onnistui! Rengas on onnistuneesti poistettu tietokannsata!");
						res.redirect("/admin/products");
					}
				});
			}
		});
	});
};
//sanitze input
function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};