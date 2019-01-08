const moment = require("moment");

var util = {};

// this function will take a time in 7:00 and adds the given minutes to it
var addMmintutesToTime = (time, duration) => {
	// determine how many hours should it increse
	var hours = Math.floor((time.mintute + duration) / 60);

	// if no hours just return the given time + the given duration
	if (hours === 0) {
		return { hour: time.hour, mintute: time.mintute + duration };
	} else {
		// determine how many minutes should it increse
		var mintute = duration - 60 * Math.floor(duration / 60);

		// if minutes was 60, return 0 as the minutes
		if (time.mintute + mintute === 60) {
			return { hour: time.hour + hours, mintute: 0 };
		}

		// return the given time + given duration
		return { hour: time.hour + hours, mintute: time.mintute + mintute };
	}
};

util.generateTimes = (max_id, year, month, expect = "times") => {
	// covert the given time and year to number
	year = Number(year);
	month = Number(month);
	max_id = Number(max_id);

	// determine what the days should be depending upon the given month
	switch (month) {
		case 1:
			var days = 31;
			break;
		case 2:
			var days = 28;
			break;
		case 3:
			var days = 31;
			break;
		case 4:
			var days = 30;
			break;
		case 5:
			var days = 31;
			break;
		case 6:
			var days = 30;
			break;
		case 7:
			var days = 31;
			break;
		case 8:
			var days = 31;
			break;
		case 9:
			var days = 30;
			break;
		case 10:
			var days = 31;
			break;
		case 11:
			var days = 30;
			break;
		case 12:
			var days = 31;
			break;
	}

	var arr = []; // initialize the array, this is the big array that the function will return
	var startTime = `${year}-${month}-01`;
	startTime = moment(startTime, "YYYY-MM-DD").format("YYYY-MM-DD"); // format the start time
	var duration = 10;
	var startHour = { hour: 8, mintute: 0 };
	var count = max_id;

	for (var i = 1; i <= days; i++) {
		// iterate (days) times
		startHour = { hour: 8, mintute: 0 }; // reset the startHour when it goes to the next day
		for (var j = 1; j <= 55; j++) {
			// 55 becase each day should have 55 times, satring from 8:00 ending in 17:00
			var obj = {
				day: startTime,
				time: moment({
					hours: startHour.hour,
					minutes: startHour.mintute
				}).format("HH:mm"),
				_id: count + 1
			};
			startHour = addMmintutesToTime(startHour, 10); // add 10 minutes to the time
			arr.push(obj);
			count++;
		}
		startTime = moment(startTime, "YYYY-MM-DD")
			.add(1, "d")
			.format("YYYY-MM-DD"); // add 1 day to the startTime
	}

	// if times wanted from function, just return the times in array
	if (expect === "times") {
		return arr;
	} else if (expect === "data") {
		// if data wanted from the function, return the days, month and array length
		switch (month) {
			case 1:
				var month = "January";
				break;
			case 2:
				var month = "February";
				break;
			case 3:
				var month = "March";
				break;
			case 4:
				var month = "April";
				break;
			case 5:
				var month = "May";
				break;
			case 6:
				var month = "June";
				break;
			case 7:
				var month = "July";
				break;
			case 8:
				var month = "August";
				break;
			case 9:
				var month = "September";
				break;
			case 10:
				var month = "October";
				break;
			case 11:
				var month = "November";
				break;
			case 12:
				var month = "December";
				break;
		}

		return {
			days,
			month,
			quantity: arr.length
		};
	}
};

module.exports = util;
