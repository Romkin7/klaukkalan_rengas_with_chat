
module.exports.renderLandingPage = (req, res, next) => {
	res.render("index/index.ejs");
};
module.exports.getLocationPage = (req, res, next) => {
	res.render("index/location.ejs");
};
module.exports.cookies = (req, res, next) => {
	res.render("index/cookies.ejs");
};
module.exports.getGdrp = (req, res, next) => {
	res.render("index/gdrp.ejs");
};
