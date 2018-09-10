$(document).ready(function() {
  //Define object that is send via ajax post request to node server
  var cartId = $("#cartId").val();
  var totalPrice = $("#totalPrice");
  var errorMsg = $("#errorMsg");
  var submitBtn1 = $("#submitBtn1");
  var submitBtn2 = $("#submitBtn2");
  var serviceObj = {
          id: "",
          total_quantity: 1,
          total_price: 0,
          total_unit_price_excluding_tax: 0,
          total_tax_amount: 0,
          method: ""
  };
  function checkServices() {
    $.get(`/ajanvaraus/${cartId}/tarkista`, function(response) {
      if(response.items.length > 0) {
        return submitBtn1.removeClass("btn-disabled");
      } else {
        return submitBtn1.addClass("btn-disabled");
      }
    });
  };
  function checkTime() {
    $.get(`/ajanvaraus/${cartId}/tarkista`, function(response) {
      if(response.time) {
        return submitBtn2.removeClass("btn-disabled");
      } else {
        return submitBtn2.addClass("btn-disabled");
      }
    });
  };
  checkServices();
  checkTime();
  var selectedServices = $("#selectedServices");
  //Add event listener, to select category
  $(".bookingService").on("click", ".tyretypeBtn", function() {
    var url = "/ajanvaraus/"+cartId+"/"+$(this).closest(".bookingService").attr("value");
    var data = {
      category: $(this).closest(".bookingService").attr("value"),
      tyre_size: $(this).attr("value")
    };
    $.getJSON(url.toLowerCase(), data).done((response) => {
      $("#datarow").html("");
      response.services.forEach(function(service) {
        $("#datarow").append(`
          <tr class="service" value="${service._id}">
            <td>${service.name}</td>
            <td>${service.tyre_size === 0 ? '16" ja alle / 17"' : service.tyre_size === 16 ? service.tyre_size+" ja alle" : service.tyre_size+" ja yli"}</td> 
            <td>${service.duration}min</td>
            <td>${service.discounted_unit_price !== 0 ? service.discounted_unit_price+",00 €" : service.unit_price+",00 €"}</td>
            <td>${service.additional_info}</td>
            <td>
              <div class="checkbox">
                <label class="text-left" style="font-size: 18px">
                  <input type="checkbox" total_price="${service.discounted_unit_price === 0 ? service.unit_price : service.discounted_unit_price}" total_tax_amount="${service.discounted_unit_price === 0 ? service.tax : service.discounted_tax}" total_unit_price_excluding_tax="${service.discounted_unit_price === 0 ? service.unit_price_excluding_tax : service.discounted_unit_price_excluding_taxes}" id="${service._id}" class="checkbox2">
                  <span class="cr"><i class="cr-icon fa fa-check"></i></span>
                </label>
              </div>
            </td>
          </tr>
          `);
      });
    }).fail((error) => {
      console.log(error);
    });
  });
  //Click listerners to select service
  $("#datarow").on("click", ".checkbox2", function(event) {
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
  var date;
  var day = $("#day");
  var newDate;
  var timesDisplay = $("#times");
  var selectedTime = $("#selectedTime");
  var message = $("#message");
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
        data: newDate,
        success: function(response) {
          timesDisplay.html("");
          response.times.forEach(function(time) {
            timesDisplay.append(`
              <tr time_id="${time._id}" class="${time.taken === true ? 'notSelectable' : 'selectTime' }">
                <td>${ time.time }</td>
                <td class="${time.taken === true ? 'negative' : 'positive' }">${ time.taken === true ? "varattu" : "vapaa" }</td>
              </tr>
            `);
            checkTime();
          });
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
  $("#times").on("click", ".selectTime", function(event) {
    event.stopPropagation();
    var time_id = {
      id: $(this).attr("time_id")
    };
    if(time_id !== "") {
      $.ajax({
        url: `/ajanvaraus/${cartId}/ajankohta`,
        method: "PATCH",
        data: time_id,
        success: function(response) {
          console.log(response);
          timesDisplay.html("");
          message.html(`
            <div class="ui success message">
              <i class="close icon"></i>
              <div class="header">
                Onnistui! Aika on onnistuneesti lisätty.
              </div>
              <p>Mikäli olette päättänet haluamanne ajan, voitte siirtyä täyttämään henkilötietonne.</p>
            </div>
          `);
          selectedTime.html("");
          selectedTime.html(`
            <thead class="tablet desktop">
              <tr>
                <th>Valittu Päivä</th>
                <th>Valittu Aika</th>
              </tr>
            </thead>
            <tbody id="times">
              <tr>
                <td>${ moment(response.cart.time.day).format('DD.MM.YYYY') }</td>
                <td>${ response.cart.time.time }</td>
              </tr>
            </tbody>
          `);
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
  //===============================================================================================
  // semantic ui messages closing
  $('#errorMsg').on('click', '.close', function() { 
    $(this).parent().hide(); 
  });
  $('#message').on('click', '.close', function() { 
    $(this).parent().hide(); 
  });
});
