//Capitalize first letter
module.exports.capitalizeFirstLetter = (string) => {
  if (string !== "") {
    return (
      string
        .trim()
        .charAt(0)
        .toUpperCase() + string.slice(1)
    );
  } else {
    return "";
  }
};
//Split array
module.exports._splitArray = (input) => {
  var output;
  if (input && input.length > 0) {
    output = input.split(",");
  } else {
    output = [];
  }
  return output;
};
//create ordernumber
//order number config function
module.exports.orderNumber = () => {
  let now = Date.now().toString(); // '1492341545873'
  // pad with extra random digit
  now += now + Math.floor(Math.random() * 10);
  // format
  return [now.slice(0, 4), now.slice(4, 10), now.slice(10, 14)].join("-");
}
//Sanitize input
module.exports.escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?,\\^$|#\s]/g, "\\$&");
};
//Set Title
module.exports.setTitle = (category, cartype, queryString, size) => {
	let title = "";
	if(cartype) {
		title = `${cartype} ${category === "Talvirenkaat-Kitka" ? "kitka talvirenkaat" : category === "Talvirenkaat-Nasta" ? "nasta talvirenkaat" : category}`;
	} else if(size) {
		title = `${size} koon ${cartype} ${category === "Talvirenkaat-Kitka" ? "kitka talvirenkaat" : category === "Talvirenkaat-Nasta" ? "nasta talvirenkaat" : category}`;
	} else if(queryString) {
		title = `Tuloksia hakusanalle ${queryString}`
	} else {
		title = "Kalaukkalan Rengas - Renkaat"
	}
	return title;
}