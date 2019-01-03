$(document).ready(function(){var t=$("body");$(document).on({ajaxStart:function(){t.addClass("loading")},ajaxStop:function(){t.removeClass("loading")}});var e=$("#cartId").val(),a=$("#totalPrice"),n=$("#errorMsg"),i=$(".submitBtn1"),s=$("#submitBtn2"),o={id:"",total_quantity:1,total_price:0,total_unit_price_excluding_tax:0,total_tax_amount:0,method:""};if(window.location.pathname==="/ajanvaraus/"+e){function l(){$.get(`/ajanvaraus/${e}/tarkista_palvelut`,function(t){return t.items.length>0?(n.html(""),i.removeClass("btn-disabled")):(n.html('\n            <div class="ui info message">\n              <i class="close icon"></i>\n              <div class="header">\n                Huom!\n              </div>\n              <ul class="list">\n                <li>Valitse vähintään yksi palvelu jatkaaksesi.</li>\n             </ul>\n          </div>\n        '),i.addClass("btn-disabled"))})}l()}if(window.location.pathname==="/ajanvaraus/"+e+"/ajankohta"){function d(){$.get(`/ajanvaraus/${e}/tarkista_ajat`,function(t){return console.log(t),t.length?($("#selectedTime").show(500),s.prop("disabled",!1),s.removeClass("btn-disabled")):($("#selectedTime").hide(500),s.prop("disabled",!0),s.addClass("btn-disabled"))})}d()}var r=$("#selectedServices");if($(".datarow").on("click",".checkbox2",function(t){t.stopPropagation(),o.id=$(this).attr("id"),o.method="add",o.total_price=$(this).attr("total_price"),o.total_tax_amount=$(this).attr("total_tax_amount"),o.total_unit_price_excluding_tax=$(this).attr("total_unit_price_excluding_tax"),""!==o.id&&o.total_price>0&&o.total_tax_amount>0&&o.total_unit_price_excluding_tax>0&&$.ajax({url:`/ajanvaraus/${e}`,method:"PATCH",data:o,success:function(t){$("html, body").animate({scrollTop:0},"medium"),"success"===t.message&&(n.html(""),n.html('\n              <div class="ui success message">\n                <i class="close icon"></i>\n                <div class="header">\n                  Onnistui! Pelvelu on onnistuneesti lisätty.\n                </div>\n                <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>\n              </div>\n            '),a.html(`${t.cart.total_price_including_tax},00 €`),r.html(""),t.cart.items.forEach(function(t){r.append(`\n                <tr class="service" value="${t._id}">\n                  <td>${t.name}</td>\n                  <td>${0===t.tyre_size?'16" ja alle / 17"':16===t.tyre_size?t.tyre_size+" ja alle":t.tyre_size+" ja yli"}</td> \n                  <td>${t.duration}min</td>\n                  <td>${0!==t.discounted_unit_price?t.discounted_unit_price+",00 €":t.unit_price+",00 €"}</td>\n                  <td>${t.additional_info}</td>\n                  <td>\n                    <form class="ui form">\n                      <label class="text-left">\n                        <button type="button" total_price="${0===t.discounted_unit_price?t.unit_price:t.discounted_unit_price}" total_tax_amount="${0===t.discounted_unit_price?t.tax:t.discounted_tax}" total_unit_price_excluding_tax="${0===t.discounted_unit_price?t.unit_price_excluding_tax:t.discounted_unit_price_excluding_taxes}" id="${t._id}" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                      </label>\n                    </form>\n                  </td>\n              `),l()}))},error:function(t){console.log(t),n.html(`\n           <div class="ui warning message">\n            <i class="close icon"></i>\n            <div class="header">\n              ${t.responseJSON.error}\n            </div>\n            ${t.responseJSON.message}\n            Yrittäkää hetken kuluttua uudelleen.\n          </div>\n          `)}})}),$("#selectedServices").on("click",".removeService",function(t){t.stopPropagation(),o.id=$(this).attr("id"),o.method="remove",o.total_price=$(this).attr("total_price"),o.total_tax_amount=$(this).attr("total_tax_amount"),o.total_unit_price_excluding_tax=$(this).attr("total_unit_price_excluding_tax"),console.log(o),""!==o.id&&o.total_price>0&&o.total_tax_amount>0&&o.total_unit_price_excluding_tax>0&&$.ajax({url:`/ajanvaraus/${e}`,method:"PATCH",data:o,success:function(t){"success"===t.message&&(n.html('\n              <div class="ui success message">\n                <i class="close icon"></i>\n                <div class="header">\n                  Onnistui! Pelvelu on onnistuneesti poistettu.\n                </div>\n                <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>\n              </div>\n            '),l(),a.html(`${t.cart.total_price_including_tax},00 €`),r.html(""),t.cart.items.forEach(function(t){r.append(`\n                <tr class="service" value="${t._id}">\n                  <td>${t.name}</td>\n                  <td>${0===t.tyre_size?'16" ja alle / 17"':16===t.tyre_size?t.tyre_size+" ja alle":t.tyre_size+" ja yli"}</td> \n                  <td>${t.duration}min</td>\n                  <td>${0!==t.discounted_unit_price?t.discounted_unit_price+",00 €":t.unit_price+",00 €"}</td>\n                  <td>${t.additional_info}</td>\n                    <td>\n                    <form class="ui form">\n                      <label class="text-left">\n                        <button type="button" total_price="${0===t.discounted_unit_price?t.unit_price:t.discounted_unit_price}" total_tax_amount="${0===t.discounted_unit_price?t.tax:t.discounted_tax}" total_unit_price_excluding_tax="${0===t.discounted_unit_price?t.unit_price_excluding_tax:t.discounted_unit_price_excluding_taxes}" id="${t._id}" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                      </label>\n                    </form>\n                  </td>\n                </tr>\n              `)}))},error:function(t){n.html(`\n           <div class="ui warning message">\n            <i class="close icon"></i>\n            <div class="header">\n              ${err.responseJSON.error}\n            </div>\n            ${err.responseJSON.message}\n            Yrittäkää hetken kuluttua uudelleen.\n          </div>\n        `)}})}),window.location.pathname==="/ajanvaraus/"+e+"/ajankohta"){var c,u,_=$("#day"),m=($("#td07"),$("#td08"),$("#td09"),$("#td10"),$("#td11"),$("#td12"),$("#td13"),$("#td14"),$("#td15"),$("#td16"),$("#td17"),$(".timesTd")),p=$("#selectedTime"),h=$("#message");function v(t,e,a){return console.log(e),a(t.filter(t=>{if(t.time.split(":")[0]===e)return t}))}c=new Date,u=`Aikoja päivälle ${moment(c).format("DD.MM.YYYY")}`,_.html(u),$("#calendar").on("click","td",function(){var t,a;c=$(this).attr("id"),u=c.split("_")[3],_.html(""),_.html(`Aikoja päivälle ${t=u,a=t.split("-"),`${a[2]}.${a[1]}.${a[0]}`}`),$.ajax({url:`/ajanvaraus/${e}/ajankohta?day=${u}`,type:"GET",success:function(t,e,a){m.html("");for(var n=7;n<18;)v(t.times,n<10?"0"+String(n):String(n),function(t){t.forEach(function(t){$(n<10?"#td0"+String(n):"#td"+String(n)).append(`\n                  <form class="time-box" time_id="${t._id}" id="${t._id}" hour="${t.time}">\n                    <input type="hidden" name="id" value="${t._id}">\n                    <p>${t.time}</p>\n                    <p>${t.quantity}/3</p>\n                  </form>\n                `)})}),n++},error:function(t){h.html(""),h.html(`\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                ${err.responseJSON.error}\n              </div>\n              ${err.responseJSON.message}\n              Yrittäkää hetken kuluttua uudelleen.\n            </div>\n          `)}})}),$("#calendar").zabuto_calendar({year:c.getFullYear(),month:c.getMonth()+1,show_previous:!1,show_next:2,today:!0,cell_border:!0,show_days:!0,weekstartson:1,nav_icon:{prev:'<i class="fa fa-chevron-circle-left"></i>',next:'<i class="fa fa-chevron-circle-right"></i>'},legend:[{type:"text",label:"Vapaita aikoja",badge:"00"},{type:"block",label:"Paljon aikoja",classname:"green"},{type:"spacer"},{type:"text",label:"Ei vapaita aikoja"},{type:"list",list:["grade-1","grade-2","grade-3","grade-4"]},{type:"text",label:"Hyvä"}]});var g=[],f=1;$("#times").on("mouseover",".time-box",function(t){$("#confModal");t.stopPropagation();var a={id:$(this).attr("time_id"),duration:$("#duration").val(),hour:$(this).attr("")};f>0&&$.ajax({url:"/ajanvaraus/"+e+"/kesto",method:"PATCH",data:a,global:!1,success:function(t){g=[],f=0,$(".time-box").removeClass("green-td-bg");for(var e=0;e<t.length;e++)$("#"+t[e]._id).addClass("green-td-bg"),g.push(t[e]._id)},error:function(){f=1}})}),$("#times").on("mouseleave",".time-box",function(t){t.stopPropagation(),f=1});p=$("#selectedTime");var x=$("#selectedTimesTable"),b=$("#timeSelectionTable");$("#times").on("click",".time-box",function(t){t.stopPropagation(),$("#confModal").modal("show"),$("#acceptTime").on("click",function(){g.length&&$.ajax({url:"/ajanvaraus/"+e+"/ajankohta",method:"PUT",data:g,success:function(t){console.log(t),h.html('\n              <div class="ui success message">\n                <i class="close icon"></i>\n                <div class="header">\n                  Onnistui! Aika on onnistuneesti lisätty.\n                </div>\n                <p>Mikäli olette päättänet haluamanne ajan, voitte siirtyä täyttämään henkilötietonne.</p>\n              </div>\n            '),p.show(200),x.html(`\n              <tr>\n                <td>${moment(t[0].day).format("DD.MM.YYYY")}</td>\n                <td>alkaen klo ${t[0].time}</td>\n              </tr>\n            `),$("#confModal").modal("hide"),b.hide(500),$("#submitBtn2").prop("disabled",!1),$("html, body").animate({scrollTop:0},"medium"),d()},error:function(t){h.html(""),h.html(`\n                <div class="ui warning message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    ${t.responseJSON.error}\n                  </div>\n                  ${t.responseJSON.message}\n                </div>\n              `)}})}),$("#cancelTime").on("click",function(){t.stopPropagation(),$("#confModal").modal("hide")})}),$("#changeTime").on("click",function(){b.removeClass("hide"),b.addClass("show"),b.show(500)})}$("#errorMsg").on("click",".close",function(){$(this).parent().hide()}),$("#message").on("click",".close",function(){$(this).parent().hide()})});