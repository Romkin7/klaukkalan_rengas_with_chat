"use strict";$(document).ready(function(){var t=$("body");$(document).on({ajaxStart:function(){t.addClass("loading")},ajaxStop:function(){t.removeClass("loading")}});var e=$("#cartId").val(),n=$("#totalPrice"),i=$("#errorMsg"),a=$(".submitBtn1"),s=$("#submitBtn2"),o={id:"",total_quantity:1,total_price:0,total_unit_price_excluding_tax:0,total_tax_amount:0,method:""};if(window.location.pathname==="/ajanvaraus/"+e){var d=function(){$.get("/ajanvaraus/"+e+"/tarkista_palvelut",function(t){return t.items.length>0?(i.html(""),a.removeClass("btn-disabled")):(i.html('\n            <div class="ui info message">\n              <i class="close icon"></i>\n              <div class="header">\n                Huom!\n              </div>\n              <ul class="list">\n                <li>Valitse vähintään yksi palvelu jatkaaksesi.</li>\n             </ul>\n          </div>\n        '),a.addClass("btn-disabled"))})};d();var l=$("#selectedServices");$(".datarow").on("click",".checkbox2",function(t){t.stopPropagation(),o.id=$(this).attr("id"),o.method="add",o.total_price=$(this).attr("total_price"),o.total_tax_amount=$(this).attr("total_tax_amount"),o.total_unit_price_excluding_tax=$(this).attr("total_unit_price_excluding_tax"),""!==o.id&&o.total_price>0&&o.total_tax_amount>0&&o.total_unit_price_excluding_tax>0&&$.ajax({url:"/ajanvaraus/"+e,method:"PATCH",data:o,success:function(t){$("html, body").animate({scrollTop:0},"medium"),"success"===t.message&&(i.html(""),i.html('\n                <div class="ui success message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    Onnistui! Pelvelu on onnistuneesti lisätty.\n                  </div>\n                  <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>\n                </div>\n              '),n.html(t.cart.total_price_including_tax+",00 €"),l.html(""),t.cart.items.forEach(function(t){l.append('\n                <tr class="service" value="'+t._id+'">\n                  <td>'+t.name+"</td>\n                  <td>"+(0===t.tyre_size?'16" ja alle / 17"':16===t.tyre_size?t.tyre_size+" ja alle":t.tyre_size+" ja yli")+"</td> \n                  <td>"+t.duration+"min</td>\n                  <td>"+(0!==t.discounted_unit_price?t.discounted_unit_price+",00 €":t.unit_price+",00 €")+"</td>\n                  <td>"+t.additional_info+'</td>\n                  <td>\n                    <form class="ui form">\n                      <label class="text-left">\n                        <button type="button" total_price="'+(0===t.discounted_unit_price?t.unit_price:t.discounted_unit_price)+'" total_tax_amount="'+(0===t.discounted_unit_price?t.tax:t.discounted_tax)+'" total_unit_price_excluding_tax="'+(0===t.discounted_unit_price?t.unit_price_excluding_tax:t.discounted_unit_price_excluding_taxes)+'" id="'+t._id+'" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                      </label>\n                    </form>\n                  </td>\n                '),d()}))},error:function(t){i.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                '+t.responseJSON.error+"\n              </div>\n              "+t.responseJSON.message+"\n              Yrittäkää hetken kuluttua uudelleen.\n            </div>\n          ")}})}),$("#selectedServices").on("click",".removeService",function(t){t.stopPropagation(),o.id=$(this).attr("id"),o.method="remove",o.total_price=$(this).attr("total_price"),o.total_tax_amount=$(this).attr("total_tax_amount"),o.total_unit_price_excluding_tax=$(this).attr("total_unit_price_excluding_tax"),""!==o.id&&o.total_price>0&&o.total_tax_amount>0&&o.total_unit_price_excluding_tax>0&&$.ajax({url:"/ajanvaraus/"+e,method:"PATCH",data:o,success:function(t){"success"===t.message&&(i.html('\n                <div class="ui success message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    Onnistui! Pelvelu on onnistuneesti poistettu.\n                  </div>\n                  <p>Mikäli olette valinneet haluamanne palvelut, voitte siirtyä varaamaan ajankohtaa.</p>\n                </div>\n              '),d(),n.html(t.cart.total_price_including_tax+",00 €"),l.html(""),t.cart.items.forEach(function(t){l.append('\n                  <tr class="service" value="'+t._id+'">\n                    <td>'+t.name+"</td>\n                    <td>"+(0===t.tyre_size?'16" ja alle / 17"':16===t.tyre_size?t.tyre_size+" ja alle":t.tyre_size+" ja yli")+"</td> \n                    <td>"+t.duration+"min</td>\n                    <td>"+(0!==t.discounted_unit_price?t.discounted_unit_price+",00 €":t.unit_price+",00 €")+"</td>\n                    <td>"+t.additional_info+'</td>\n                    <td>\n                      <form class="ui form">\n                        <label class="text-left">\n                          <button type="button" total_price="'+(0===t.discounted_unit_price?t.unit_price:t.discounted_unit_price)+'" total_tax_amount="'+(0===t.discounted_unit_price?t.tax:t.discounted_tax)+'" total_unit_price_excluding_tax="'+(0===t.discounted_unit_price?t.unit_price_excluding_tax:t.discounted_unit_price_excluding_taxes)+'" id="'+t._id+'" class="ui red button removeService"><i class="fa fa-times" aria-hidden="true"></i></button>\n                        </label>\n                      </form>\n                    </td>\n                  </tr>\n                ')}))},error:function(t){i.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                '+err.responseJSON.error+"\n              </div>\n              "+err.responseJSON.message+"\n              Yrittäkää hetken kuluttua uudelleen.\n            </div>\n          ")}})})}if(window.location.pathname==="/ajanvaraus/"+e+"/ajankohta"){var r,c=function(){$.get("/ajanvaraus/"+e+"/tarkista_ajat",function(t){return t.length?($("#selectedTime").show(500),s.prop("disabled",!1),s.removeClass("btn-disabled")):($("#selectedTime").hide(500),s.prop("disabled",!0),s.addClass("btn-disabled"))})},u=function(t,e,n){return n(t.filter(function(t){if(t.time.split(":")[0]===e)return t}))};$('[data-toggle="datepicker"]').datepicker({autoHide:!0,startDate:moment(Date.now()).format("DD/MM/YYYY"),zIndex:2048,inline:!0,format:"dd.MM.YYYY",language:"fi-FI",filter:function(t,e){if(0===t.getDay()&&"day"===e)return!1}}),c();$("#td07"),$("#td08"),$("#td09"),$("#td10"),$("#td11"),$("#td12"),$("#td13"),$("#td14"),$("#td15"),$("#td16"),$("#td17");var m=$(".timesTd"),_=$("#selectedTime"),p=$("#message");Date.prototype.sameDay=function(t){return this.getFullYear()===t.getFullYear()&&this.getDate()===t.getDate()&&this.getMonth()===t.getMonth()},r=new Date,"Aikoja päivälle "+moment(r).format("DD.MM.YYYY"),$('[data-toggle="datepicker"]').on("change",function(){var t,n,i=$('[data-toggle="datepicker"]').datepicker("getDate",!0);$.ajax({url:"/ajanvaraus/"+e+"/ajankohta?day="+(t=i,n=t.split("."),n[2]+"-"+n[1]+"-"+n[0]),type:"GET",success:function(t,e,n){m.html("");for(var i,a,s=7;s<18;)u(t.times,s<10?"0"+String(s):String(s),function(t){t.forEach(function(t){i=moment(t.day).format("DD/MM/YYYY"),i=new Date(i),a=moment(Date.now()).format("DD/MM/YYYY"),a=new Date(a),$(s<10?"#td0"+String(s):"#td"+String(s)).append('\n                  <form class="time-box '+(t.taken?"red-td-bg":i<=a&&100*parseFloat(t.time.split(":").join(".")).toFixed(2)<100*parseFloat(moment(Date.now()).format("HH.mm")).toFixed(2)?"gray-td-bg":"green-td-bg")+'" time_id="'+t._id+'" id="'+t._id+'" hour="'+t.time+'">\n                    <input type="hidden" name="id" value="'+t._id+'">\n                    <p>'+t.time+"</p>\n                    <p>"+t.quantity+"/3</p>\n                  </form>\n                ")})}),s++},error:function(t){p.html(""),p.html('\n            <div class="ui warning message">\n              <i class="close icon"></i>\n              <div class="header">\n                '+err.responseJSON.error+"\n              </div>\n              "+err.responseJSON.message+"\n              Yrittäkää hetken kuluttua uudelleen.\n            </div>\n          ")}})});var h=[],g=1;$("#times").on("mouseover",".time-box",function(t){$("#confModal");t.stopPropagation();var n={id:$(this).attr("time_id"),duration:$("#duration").val(),hour:$(this).attr("")};g>0&&$.ajax({url:"/ajanvaraus/"+e+"/kesto",method:"PATCH",data:n,global:!1,success:function(t){h=[],g=0,$(".time-box").removeClass("orange-td-bg");for(var e=0;e<t.length;e++)$("#"+t[e]._id).addClass("orange-td-bg"),h.push(t[e]._id)},error:function(){g=1}})}),$("#times").on("mouseleave",".time-box",function(t){t.stopPropagation(),g=1});var v=$(".serviceSection"),f=(_=$("#selectedTime"),$("#selectedTimesTable")),x=$("#timeSelectionInput"),b=$("#timeSelectionTable");$("#times").on("click",".time-box",function(t){t.stopPropagation(),$("#confModal").modal("show"),$("#acceptTime").on("click",function(){h.length&&$.ajax({url:"/ajanvaraus/"+e+"/ajankohta",method:"PUT",data:h,success:function(t){p.html('\n              <div class="ui success message">\n                <i class="close icon"></i>\n                <div class="header">\n                  Onnistui! Aika on onnistuneesti lisätty.\n                </div>\n                <p>Mikäli olette päättänet haluamanne ajan, voitte siirtyä täyttämään henkilötietonne.</p>\n              </div>\n            '),_.show(200),f.html("\n              <tr>\n                <td>"+moment(t[0].day).format("DD.MM.YYYY")+"</td>\n                <td>alkaen klo "+t[0].time+"</td>\n              </tr>\n            "),$("#confModal").modal("hide"),b.toggleClass("hidden"),v.toggleClass("hidden"),x.toggleClass("hidden"),$("#submitBtn2").prop("disabled",!1),$("html, body").animate({scrollTop:0},"medium"),c()},error:function(t){p.html(""),p.html('\n                <div class="ui warning message">\n                  <i class="close icon"></i>\n                  <div class="header">\n                    '+t.responseJSON.error+"\n                  </div>\n                  "+t.responseJSON.message+"\n                </div>\n              ")}})}),$("#cancelTime").on("click",function(){t.stopPropagation(),$("#confModal").modal("hide")})}),$("#changeTime").on("click",function(){x.toggleClass("hidden"),b.toggleClass("hidden"),v.toggleClass("hidden")})}$("#errorMsg").on("click",".close",function(){$(this).parent().hide()}),$("#message").on("click",".close",function(){$(this).parent().hide()})});