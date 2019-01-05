'use strict';

$(document).ready(function () {
  function scrollTop() {
    return $('html, body').animate({ scrollTop: 0 }, 'medium');
  };
  var $body = $("body");
  $(document).on({
    ajaxStart: function ajaxStart() {
      $body.addClass("loading");
    },
    ajaxStop: function ajaxStop() {
      $body.removeClass("loading");
    }
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
  if (window.location.pathname === "/ajanvaraus/" + cartId) {
    var checkServices = function checkServices() {
      $.get('/ajanvaraus/' + cartId + '/tarkista_palvelut', function (response) {
        if (response.items.length > 0) {
          errorMsg.html("");
          return submitBtn1.removeClass("btn-disabled");
        } else {
          errorMsg.html('\n            <div class="ui info message">\n              <i class="close icon"></i>\n              <div class="header">\n                Huom!\n              </div>\n              <ul class="list">\n                <li>Valitse v\xE4hint\xE4\xE4n yksi palvelu jatkaaksesi.</li>\n             </ul>\n          </div>\n        ');
          return submitBtn1.addClass("btn-disabled");
        }
      });
    };

    ;
    checkServices();
    var selectedServices = $("#selectedServices");
    //Add event listener, to select category
    //Click listerners to select service
    $(".datarow").on("click", ".checkbox2", function (event) {
      event.stopPropagation();
      serviceObj.id = $(this).attr("id");
      serviceObj.method = "add";
      serviceObj.total_price = $(this).attr("total_price");
      serviceObj.total_tax_amount = $(this).attr("total_tax_amount");
      serviceObj.total_unit_price_excluding_tax = $(this).attr("total_unit_price_excluding_tax");
      if (serviceObj.id !== "" && serviceObj.total_price > 0 && serviceObj.total_tax_amount > 0 && serviceObj.total_unit_price_excluding_tax > 0) {
        $.ajax({
          url: '/ajanvaraus/' + cartId,
          method: "PATCH",
          data: serviceObj,
          success: function success(response) {
            scrollTop(1000);
            if (response.message === "success") {
              errorMsg.html("");
              errorMsg.html('\n                <div class="ui success message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    Onnistui! Pelvelu on onnistuneesti lis\xE4tty.\n                  </div>\n                  <p>Mik\xE4li olette valinneet haluamanne palvelut, voitte siirty\xE4 varaamaan ajankohtaa.</p>\n                </div>\n              ');
              totalPrice.html(response.cart.total_price_including_tax + ',00 \u20AC');
              selectedServices.html("");
              response.cart.items.forEach(function (service) {
                selectedServices.append('\n                <tr class="service" value="' + service._id + '">\n                  <td>' + service.name + '</td>\n                  <td>' + (service.tyre_size === 0 ? '16" ja alle / 17"' : service.tyre_size === 16 ? service.tyre_size + " ja alle" : service.tyre_size + " ja yli") + '</td> \n                  <td>' + service.duration + 'min</td>\n                  <td>' + (service.discounted_unit_price !== 0 ? service.discounted_unit_price + ",00 €" : service.unit_price + ",00 €") + '</td>\n                  <td>' + service.additional_info + '</td>\n                  <td>\n                    <form class="ui form">\n                      <label class="text-left">\n                        <button type="button" total_price="' + (service.discounted_unit_price === 0 ? service.unit_price : service.discounted_unit_price) + '" total_tax_amount="' + (service.discounted_unit_price === 0 ? service.tax : service.discounted_tax) + '" total_unit_price_excluding_tax="' + (service.discounted_unit_price === 0 ? service.unit_price_excluding_tax : service.discounted_unit_price_excluding_taxes) + '" id="' + service._id + '" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                      </label>\n                    </form>\n                  </td>\n                ');
                checkServices();
              });
            } else {}
          },
          error: function error(err) {
            //show error here
            errorMsg.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                ' + err.responseJSON.error + '\n              </div>\n              ' + err.responseJSON.message + '\n              Yritt\xE4k\xE4\xE4 hetken kuluttua uudelleen.\n            </div>\n          ');
          }
        });
      }
    });
    //Listener to remove service
    $("#selectedServices").on("click", ".removeService", function (event) {
      event.stopPropagation();
      serviceObj.id = $(this).attr("id");
      serviceObj.method = "remove";
      serviceObj.total_price = $(this).attr("total_price");
      serviceObj.total_tax_amount = $(this).attr("total_tax_amount");
      serviceObj.total_unit_price_excluding_tax = $(this).attr("total_unit_price_excluding_tax");
      if (serviceObj.id !== "" && serviceObj.total_price > 0 && serviceObj.total_tax_amount > 0 && serviceObj.total_unit_price_excluding_tax > 0) {
        $.ajax({
          url: '/ajanvaraus/' + cartId,
          method: "PATCH",
          data: serviceObj,
          success: function success(response) {
            if (response.message === "success") {
              errorMsg.html('\n                <div class="ui success message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    Onnistui! Pelvelu on onnistuneesti poistettu.\n                  </div>\n                  <p>Mik\xE4li olette valinneet haluamanne palvelut, voitte siirty\xE4 varaamaan ajankohtaa.</p>\n                </div>\n              ');
              checkServices();
              totalPrice.html(response.cart.total_price_including_tax + ',00 \u20AC');
              selectedServices.html("");
              response.cart.items.forEach(function (service) {
                selectedServices.append('\n                  <tr class="service" value="' + service._id + '">\n                    <td>' + service.name + '</td>\n                    <td>' + (service.tyre_size === 0 ? '16" ja alle / 17"' : service.tyre_size === 16 ? service.tyre_size + " ja alle" : service.tyre_size + " ja yli") + '</td> \n                    <td>' + service.duration + 'min</td>\n                    <td>' + (service.discounted_unit_price !== 0 ? service.discounted_unit_price + ",00 €" : service.unit_price + ",00 €") + '</td>\n                    <td>' + service.additional_info + '</td>\n                    <td>\n                      <form class="ui form">\n                        <label class="text-left">\n                          <button type="button" total_price="' + (service.discounted_unit_price === 0 ? service.unit_price : service.discounted_unit_price) + '" total_tax_amount="' + (service.discounted_unit_price === 0 ? service.tax : service.discounted_tax) + '" total_unit_price_excluding_tax="' + (service.discounted_unit_price === 0 ? service.unit_price_excluding_tax : service.discounted_unit_price_excluding_taxes) + '" id="' + service._id + '" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                        </label>\n                      </form>\n                    </td>\n                  </tr>\n                ');
              });
            }
          },
          error: function error(_error) {
            //show error here
            errorMsg.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                ' + err.responseJSON.error + '\n              </div>\n              ' + err.responseJSON.message + '\n              Yritt\xE4k\xE4\xE4 hetken kuluttua uudelleen.\n            </div>\n          ');
          }
        });
      }
    });
  }
  if (window.location.pathname === "/ajanvaraus/" + cartId + "/ajankohta") {
    var checkTime = function checkTime() {
      $.get('/ajanvaraus/' + cartId + '/tarkista_ajat', function (times) {
        if (times.length) {
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

    var timesByHours = function timesByHours(times, hour, cb) {
      var filteredTimes = times.filter(function (time) {
        var shortTime = time.time.split(":");
        if (shortTime[0] === hour) {
          return time;
        }
      });
      return cb(filteredTimes);
    };
    var reverseString = function reverseString(str) {
      var stringParts = str.split('.');
      var newString = stringParts[2] + '-' + stringParts[1] + '-' + stringParts[0];
      return newString;
    };

    $('[data-toggle="datepicker"]').datepicker({
      autoHide: true,
      startDate: moment(Date.now()).format("DD/MM/YYYY"),
      zIndex: 2048,
      inline: true,
      format: "dd.MM.YYYY",
      language: 'fi-FI',
      filter: function filter(date, view) {
        if (date.getDay() === 0 && view === 'day') {
          return false; // Disable all Sundays, but still leave months/years, whose first day is a Sunday, enabled.
        }
      }
    });
    ;
    checkTime();
    //=========================================================================================
    //Calendar events to pick time
    var date;
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
    ;;
    ;
    date = new Date();
    newDate = 'Aikoja p\xE4iv\xE4lle ' + moment(date).format("DD.MM.YYYY");
    $('[data-toggle="datepicker"]').on("change", function () {
      var selectedDate = $('[data-toggle="datepicker"]').datepicker("getDate", true);
      $.ajax({
        url: '/ajanvaraus/' + cartId + '/ajankohta?day=' + reverseString(selectedDate),
        type: "GET",
        success: function success(times, textStatus, xhr) {
          timesTd.html("");
          var count = 7;
          var date1;
          var date2;
          while (count < 18) {
            timesByHours(times.times, count < 10 ? "0" + String(count) : String(count), function (filteredTimes) {
              filteredTimes.forEach(function (time) {
                date1 = moment(time.day).format('DD/MM/YYYY');
                date1 = new Date(date1);
                date2 = moment(Date.now()).format('DD/MM/YYYY');
                date2 = new Date(date2);
                $(count < 10 ? "#td0" + String(count) : "#td" + String(count)).append('\n                  <form class="time-box ' + (time.taken ? 'red-td-bg' : date1 <= date2 && parseFloat(time.time.split(':').join('.')).toFixed(2) * 100 < parseFloat(moment(Date.now()).format('HH.mm')).toFixed(2) * 100 ? 'gray-td-bg' : 'green-td-bg') + '" time_id="' + time._id + '" id="' + time._id + '" hour="' + time.time + '">\n                    <input type="hidden" name="id" value="' + time._id + '">\n                    <p>' + time.time + '</p>\n                    <p>' + time.quantity + '/3</p>\n                  </form>\n                ');
              });
            });
            count++;
          }
        },
        error: function error(_error2) {
          message.html("");
          message.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                ' + err.responseJSON.error + '\n              </div>\n              ' + err.responseJSON.message + '\n              Yritt\xE4k\xE4\xE4 hetken kuluttua uudelleen.\n            </div>\n          ');
        }
      });
    });
    //Book time
    var timeIds = [];
    var request_limit = 1;
    $("#times").on("mouseover", ".time-box", function (event) {
      var confirmationModal = $("#confModal");
      event.stopPropagation();
      var time_id = {
        id: $(this).attr("time_id"),
        duration: $("#duration").val(),
        hour: $(this).attr("")
      };
      if (request_limit > 0) {
        $.ajax({
          url: "/ajanvaraus/" + cartId + "/kesto",
          method: "PATCH",
          data: time_id,
          global: false,
          success: function success(times) {
            timeIds = [];
            request_limit = 0;
            $(".time-box").removeClass("orange-td-bg");
            for (var i = 0; i < times.length; i++) {
              $("#" + times[i]._id).addClass("orange-td-bg");
              timeIds.push(times[i]._id);
            }
          },
          error: function error() {
            request_limit = 1;
          }
        });
      }
    });
    $("#times").on("mouseleave", ".time-box", function (event) {
      event.stopPropagation();
      request_limit = 1;
    });
    var serviceSection = $(".serviceSection");
    var selectedTime = $("#selectedTime");
    var selectedTimesTable = $("#selectedTimesTable");
    var timeSelectionInput = $("#timeSelectionInput");
    var timeSelectionTable = $("#timeSelectionTable");
    $("#times").on("click", ".time-box", function (event) {
      event.stopPropagation();
      $(".time-box").css("pointer-events", "none");
      $('#confModal').modal('show');
      $("#acceptTime").on("click", function () {
        function setTimes(time) {
          return '\n              <tr>\n                <td>' + moment(time.day).format('DD.MM.YYYY') + '</td>\n                <td>' + time.time + '</td>\n              </tr>\n            ';
        }
        if (timeIds.length) {
          $.ajax({
            url: "/ajanvaraus/" + cartId + "/ajankohta",
            method: "PUT",
            data: timeIds,
            success: function success(times) {
              message.html('\n              <div class="ui success message">\n                <i class="close icon"></i>\n                <div class="header">\n                  Onnistui! Aika on onnistuneesti lis\xE4tty.\n                </div>\n                <p>Mik\xE4li olette p\xE4\xE4tt\xE4net haluamanne ajan, voitte siirty\xE4 t\xE4ytt\xE4m\xE4\xE4n henkil\xF6tietonne.</p>\n              </div>\n            ');
              selectedTime.show(200);
              selectedTimesTable.html('\n              <tr>\n                <td>' + moment(times[0].day).format('DD.MM.YYYY') + '</td>\n                <td>alkaen klo ' + times[0].time + '</td>\n              </tr>\n            ');
              $('#confModal').modal('hide');
              $(".time-box").css("pointer-events", "auto");
              timeSelectionTable.toggleClass("hidden");
              serviceSection.toggleClass("hidden");
              timeSelectionInput.toggleClass("hidden");
              $("#submitBtn2").prop("disabled", false);
              $('html, body').animate({ scrollTop: 0 }, 'medium');
              checkTime();
            },
            error: function error(_error3) {
              $(".time-box").css("pointer-events", "auto");
              message.html("");
              message.html('\n                <div class="ui warning message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    ' + _error3.responseJSON.error + '\n                  </div>\n                  ' + _error3.responseJSON.message + '\n                </div>\n              ');
            }
          });
        }
      });
      $("#cancelTime").on("click", function () {
        event.stopPropagation();
        $(".time-box").css("pointer-events", "auto");
        $('#confModal').modal('hide');
      });
    });
    $("#changeTime").on("click", function () {
      timeSelectionInput.toggleClass("hidden");
      timeSelectionTable.toggleClass("hidden");
      serviceSection.toggleClass("hidden");
    });
  }
  //===============================================================================================
  // semantic ui messages closing
  $('#errorMsg').on('click', '.close', function () {
    $(this).parent().hide();
  });
  $('#message').on('click', '.close', function () {
    $(this).parent().hide();
  });
});