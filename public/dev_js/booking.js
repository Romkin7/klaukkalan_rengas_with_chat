$(document).ready(function() {
  function scrollTop() {
    return $('html, body').animate({ scrollTop: 0 }, 'medium');
  };
  var $body= $("body");
  $(document).on({
      ajaxStart: function() { $body.addClass("loading");},
      ajaxStop: function() { $body.removeClass("loading");}
  });
  //Define object that is send via ajax post request to node server
  var cartId = $("#cartId").val();
  var totalPrice = $("#totalPrice");
  var errorMsg = $("#errorMsg");
  var submitBtn1 = $(".submitBtn1");
  var submitBtn2 = $("#submitBtn2");
  var serviceObj = {
          id: "",
          total_quantity: 1,
          total_price: 0,
          total_unit_price_excluding_tax: 0,
          total_tax_amount: 0,
          method: ""
  };
  if(window.location.pathname === "/ajanvaraus/"+cartId) {
    function checkServices() {
      $.get(`/ajanvaraus/${cartId}/tarkista_palvelut`, function(response) {
        if(response.items.length > 0) {
          errorMsg.html("");
          return submitBtn1.removeClass("btn-disabled");
        } else {
          errorMsg.html(`
            <div class="ui info message">
              <i class="close icon"></i>
              <div class="header">
                Huom!
              </div>
              <ul class="list">
                <li>Valitse vähintään yksi palvelu jatkaaksesi.</li>
             </ul>
          </div>
        `);
        return submitBtn1.addClass("btn-disabled");
        }
      });
    };
    checkServices();
  }
  if(window.location.pathname === "/ajanvaraus/"+cartId+"/ajankohta") {
    function checkTime() {
      $.get(`/ajanvaraus/${cartId}/tarkista_ajat`, function(times) {
        console.log(times);
        if(times.length) {
          $("#selectedTime").show(500);
          submitBtn2.prop("disabled", false);
          return submitBtn2.removeClass("btn-disabled");
        } else {
          $("#selectedTime").hide(500);
          submitBtn2.prop("disabled", true);
          return submitBtn2.addClass("btn-disabled");
        }
      });
    };
    checkTime();
  }
  var selectedServices = $("#selectedServices");
  //Add event listener, to select category
  //Click listerners to select service
  $(".datarow").on("click", ".checkbox2", function(event) {
    event.stopPropagation();
    serviceObj.id = $(this).attr("id");
    serviceObj.method = "add";
    serviceObj.total_price = $(this).attr("total_price");
    serviceObj.total_tax_amount = $(this).attr("total_tax_amount");
    serviceObj.total_unit_price_excluding_tax = $(this).attr("total_unit_price_excluding_tax");
    if(serviceObj.id !== "" && serviceObj.total_price > 0 && serviceObj.total_tax_amount > 0 && serviceObj.total_unit_price_excluding_tax > 0) {
      $.ajax({
        url: `/ajanvaraus/${cartId}`,
        method: "PATCH",
        data: serviceObj,
        success: function(response) {
          scrollTop(1000);
          if(response.message === "success") {
            errorMsg.html("");
            errorMsg.html(`
              <div class="ui success message">
                <i class="close icon"></i>
                <div class="header">
                  Onnistui! Pelvelu on onnistuneesti lisätty.
                </div>
                <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>
              </div>
            `);
            totalPrice.html(`${response.cart.total_price_including_tax},00 €`);
            selectedServices.html("");
            response.cart.items.forEach(function(service) {
              selectedServices.append(`
                <tr class="service" value="${service._id}">
                  <td>${service.name}</td>
                  <td>${service.tyre_size === 0 ? '16" ja alle / 17"' : service.tyre_size === 16 ? service.tyre_size+" ja alle" : service.tyre_size+" ja yli"}</td> 
                  <td>${service.duration}min</td>
                  <td>${service.discounted_unit_price !== 0 ? service.discounted_unit_price+",00 €" : service.unit_price+",00 €"}</td>
                  <td>${service.additional_info}</td>
                  <td>
                    <form class="ui form">
                      <label class="text-left">
                        <button type="button" total_price="${service.discounted_unit_price === 0 ? service.unit_price : service.discounted_unit_price}" total_tax_amount="${service.discounted_unit_price === 0 ? service.tax : service.discounted_tax}" total_unit_price_excluding_tax="${service.discounted_unit_price === 0 ? service.unit_price_excluding_tax : service.discounted_unit_price_excluding_taxes}" id="${service._id}" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>
                      </label>
                    </form>
                  </td>
              `);
              checkServices();
            });
          } else {

          }
        },
        error : function(err) {
          console.log(err);
          //show error here
          errorMsg.html(`
           <div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              ${err.responseJSON.error}
            </div>
            ${err.responseJSON.message}
            Yrittäkää hetken kuluttua uudelleen.
          </div>
          `);
        }
      });
    }
  });
  //Listener to remove service
  $("#selectedServices").on("click", ".removeService", function(event) {
    event.stopPropagation();
    serviceObj.id = $(this).attr("id");
    serviceObj.method = "remove";
    serviceObj.total_price = $(this).attr("total_price");
    serviceObj.total_tax_amount = $(this).attr("total_tax_amount");
    serviceObj.total_unit_price_excluding_tax = $(this).attr("total_unit_price_excluding_tax");
    console.log(serviceObj);
    if(serviceObj.id !== "" && serviceObj.total_price > 0 && serviceObj.total_tax_amount > 0 && serviceObj.total_unit_price_excluding_tax > 0) {
      $.ajax({
        url: `/ajanvaraus/${cartId}`,
        method: "PATCH",
        data: serviceObj,
        success: function(response) {
          if(response.message === "success") {
             errorMsg.html(`
              <div class="ui success message">
                <i class="close icon"></i>
                <div class="header">
                  Onnistui! Pelvelu on onnistuneesti poistettu.
                </div>
                <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>
              </div>
            `);
            checkServices();
            totalPrice.html(`${response.cart.total_price_including_tax},00 €`);
            selectedServices.html("");
            response.cart.items.forEach(function(service) {
            selectedServices.append(`
                <tr class="service" value="${service._id}">
                  <td>${service.name}</td>
                  <td>${service.tyre_size === 0 ? '16" ja alle / 17"' : service.tyre_size === 16 ? service.tyre_size+" ja alle" : service.tyre_size+" ja yli"}</td> 
                  <td>${service.duration}min</td>
                  <td>${service.discounted_unit_price !== 0 ? service.discounted_unit_price+",00 €" : service.unit_price+",00 €"}</td>
                  <td>${service.additional_info}</td>
                    <td>
                    <form class="ui form">
                      <label class="text-left">
                        <button type="button" total_price="${service.discounted_unit_price === 0 ? service.unit_price : service.discounted_unit_price}" total_tax_amount="${service.discounted_unit_price === 0 ? service.tax : service.discounted_tax}" total_unit_price_excluding_tax="${service.discounted_unit_price === 0 ? service.unit_price_excluding_tax : service.discounted_unit_price_excluding_taxes}" id="${service._id}" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>
                      </label>
                    </form>
                  </td>
                </tr>
              `);
            });
          } 
        },
        error: function(error) {
          //show error here
          errorMsg.html(`
           <div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">
              ${err.responseJSON.error}
            </div>
            ${err.responseJSON.message}
            Yrittäkää hetken kuluttua uudelleen.
          </div>
        `);
        }
      });
    }
  });
  //=========================================================================================
  //Calendar events to pick time
  if(window.location.pathname === "/ajanvaraus/"+cartId+"/ajankohta") {
    var date;
    var day = $("#day");
    var newDate;
    var td07 = $("#td07");
    var td08 = $("#td08");
    var td09 = $("#td09");
    var td10 = $("#td10");
    var td11 = $("#td11");
    var td12 = $("#td12");
    var td13 = $("#td13");
    var td14 = $("#td14");
    var td15 = $("#td15");
    var td16 = $("#td16");
    var td17 = $("#td17");
    var timesTd = $(".timesTd");
    var selectedTime = $("#selectedTime");
    var message = $("#message");
    function timesByHours(times, hour, cb) {
      console.log(hour);
      let filteredTimes = times.filter((time) => {
        var shortTime = time.time.split(":");
        if(shortTime[0] === hour) {
          return time
        }
      });
      return cb(filteredTimes);
    };
    function reverseString(str) {
      var stringParts = str.split('-');
      var newString = `${stringParts[2]}.${stringParts[1]}.${stringParts[0]}`;
      return newString;
    };
    date = new Date();
    newDate = `Aikoja päivälle ${moment(date).format("DD.MM.YYYY")}`;
    day.html(newDate);
    $("#calendar").on("click", "td", function() {
      date = $(this).attr("id");
      newDate = date.split("_")[3];
      day.html("");
      day.html(`Aikoja päivälle ${reverseString(newDate)}`);
      $.ajax({
        url: `/ajanvaraus/${cartId}/ajankohta?day=${newDate}`,
        type: "GET",
        success: function(times, textStatus, xhr) {
          timesTd.html("");
          var count = 7;
          while(count < 18) {
            timesByHours(times.times, count < 10 ? "0"+String(count) : String(count), function(filteredTimes) { 
              filteredTimes.forEach(function(time) {
                $(count < 10 ? "#td0"+String(count) : "#td"+String(count)).append(`
                  <form class="time-box" time_id="${time._id }" id="${ time._id }">
                    <input type="hidden" name="id" value="${ time._id }">
                    <p>${ time.time }</p>
                    <p>${ time.quantity }/3</p>
                  </form>
                `);
              });
            });
            count++;
          }
        },
        error: function(error) {
          message.html("");
          message.html(`
            <div class="ui warning message">
              <i class="close icon"></i>
              <div class="header">
                ${err.responseJSON.error}
              </div>
              ${err.responseJSON.message}
              Yrittäkää hetken kuluttua uudelleen.
            </div>
          `);
        }
      });
  });
  $("#calendar").zabuto_calendar({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      show_previous: false,
      show_next: 2,
      today: true,
      cell_border: true,
      show_days: true,
      weekstartson: 1,
      nav_icon: {
        prev: '<i class="fa fa-chevron-circle-left"></i>',
        next: '<i class="fa fa-chevron-circle-right"></i>'
      },
       legend: [
        {type: "text", label: "Vapaita aikoja", badge: "00"},
        {type: "block", label: "Paljon aikoja", classname: "green"},
        {type: "spacer"},
        {type: "text", label: "Ei vapaita aikoja"},
        {type: "list", list: ["grade-1", "grade-2", "grade-3", "grade-4"]},
        {type: "text", label: "Hyvä"}
      ]
    });
    //Book time
    var timeIds = [];
    $("#times").on("mouseover", ".time-box", function(event) {
      var confirmationModal = $("#confModal");
      event.stopPropagation();
      var time_id = {
        id: $(this).attr("time_id"),
        duration: $("#duration").val()
      };
     
        $.ajax({
          url: "/ajanvaraus/"+cartId+"/kesto",
          method: "PATCH",
          data: time_id,
          success: function(times) {
            timeIds = [];
            $(".time-box").removeClass("green-td-bg");
            for(var i = 0; i < times.length; i++) {
              $("#"+times[i]._id).addClass("green-td-bg");
              timeIds.push(times[i]._id);
            }
          } 
        });
    });
    var selectedTime = $("#selectedTime");
    var selectedTimesTable = $("#selectedTimesTable");
    var timeSelectionTable = $("#timeSelectionTable");
    $("#times").on("click", ".time-box", function(event) {
      event.stopPropagation();
      $('#confModal')
        .modal('show')
      ;
      $("#acceptTime").on("click", function() {
        function setTimes(time) {
            return `
              <tr>
                <td>${ moment(time.day).format('DD.MM.YYYY') }</td>
                <td>${ time.time }</td>
              </tr>
            `
        }
        if(timeIds.length) {
         $.ajax({
          url: "/ajanvaraus/"+cartId+"/ajankohta",
          method: "PUT",
          data: timeIds,
          success: function(times) {
            console.log(times);
            message.html(`
              <div class="ui success message">
                <i class="close icon"></i>
                <div class="header">
                  Onnistui! Aika on onnistuneesti lisätty.
                </div>
                <p>Mikäli olette päättänet haluamanne ajan, voitte siirtyä täyttämään henkilötietonne.</p>
              </div>
            `);
            selectedTime.show(200);
            selectedTimesTable.html(`
              <tr>
                <td>${ moment(times[0].day).format('DD.MM.YYYY') }</td>
                <td>alkaen klo ${ times[0].time }</td>
              </tr>
            `);
            $('#confModal')
              .modal('hide')
            ;
            timeSelectionTable.hide(500);
            $("#submitBtn2").prop("disabled", false);
            $('html, body').animate({ scrollTop: 0 }, 'medium');
            checkTime();
            },
            error: function(error) {
              message.html("");
              message.html(`
                <div class="ui warning message">
                  <i class="close icon"></i>
                  <div class="header">
                    ${error.responseJSON.error}
                  </div>
                  ${error.responseJSON.message}
                </div>
              `);
            }
          });
        } 
      });
      $("#cancelTime").on("click", function() {
        event.stopPropagation();
        $('#confModal')
          .modal('hide')
        ;
      });
    });
    $("#changeTime").on("click", function() {
      timeSelectionTable.show(500);
    });
  }
  //===============================================================================================
  // semantic ui messages closing
  $('#errorMsg').on('click', '.close', function() { 
    $(this).parent().hide(); 
  });
  $('#message').on('click', '.close', function() { 
    $(this).parent().hide(); 
  });
});
