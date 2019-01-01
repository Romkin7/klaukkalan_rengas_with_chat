"use strict";
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tyre = require("../../models/tyre");
const paginate = require('../../middleware/paginate');
//route to get all tyres by selected category
router.get("/", async (req, res, next) => {
	var category = req.query.category;
	paginate.paginateItems(req, res, Tyre, category, (dataObj) => {
		if(req.xhr) {
			return res.status(200).json({
				tyres: dataObj.output.data,
				pages: dataObj.output.pages,
				items: dataObj.output.items,
				page_heading: dataObj.page_heading,
				car_type: dataObj.car_type,
				manufacturer: dataObj.manufacturer,
				size: dataObj.size,
				heading: req.query.category,
				searchTerm: dataObj.search,
				category: req.query.category
			});
			return;
		} else {
			console.log(req.query.category);
			return res.render("tyres/tyres", {
				tyres: dataObj.output.data,
				pages: dataObj.output.pages,
				items: dataObj.output.items,
				page_heading: dataObj.page_heading,
				car_type: dataObj.car_type,
				manufacturer: dataObj.manufacturer,
				size: dataObj.size,
				heading: req.query.category,
				searchTerm: dataObj.search,
				category: req.query.category 
			});
		}
	});
});
//Get one tyre
router.get("/:id", async (req, res, next) => {
	let tyre = await Tyre.findById(req.params.id);
	res.render("tyres/show", {
		tyre: tyre
	});
});
//Export router
module.exports = router;