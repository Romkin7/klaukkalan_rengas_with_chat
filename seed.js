// this function will take a time in 7:00 and adds the given minutes to it
function addMmintutesToTime(time, duration) {
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
}
function generateTimes(year, month) {
  // covert the given time and year to number
  year = Number(year);
  month = Number(month);

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
  var startHour = { hour: 7, mintute: 0 };

  for (var i = 1; i <= days; i++) { // iterate (days) times
    startHour = { hour: 7, mintute: 0 }; // reset the startHour when it goes to the next day
    for (var j = 1; j <= 61; j++) { // 61 becase each day should have 61 times, satring from 7:00 ending in 17:00
      var obj = {
        day: startTime,
        time: moment({
          hours: startHour.hour,
          minutes: startHour.mintute
        }).format("HH:mm")
      };
      startHour = addMmintutesToTime(startHour, 10); // add 10 minutes to the time
      arr.push(obj);
    }
    startTime = moment(startTime, "YYYY-MM-DD")
      .add(1, "d")
      .format("YYYY-MM-DD"); // add 1 day to the startTime
  }

  return arr;
};
// whenever you desire invoke the function like this:
//  generateTimes(2016, 2)
//  generateTimes('2016', '02') also works
//  generateTimes('2016', 02) also works