//Initialize websockets and chek for new orders and chat messages
$(function() {
	var socket = io();
	socket.on("connect", function() {
		console.log("Uusi käyttäjä sivustolla!");
	});
	socket.on("new-order", function(order) {
    $("#infoHeading").html("");
    $("#infoHeading").html(`Uusi Varaus rekisterinumerolle: ${order.client.register_number}`);
		$("#notificationList").append(`
			<div class="item">
        <div class="ui tiny image">
          <img src="/images/order.png">
        </div>
        <div class="middle aligned content">
          <div class="header">
            Varaus rekisterinumerolle ${order.client.register_number}
          </div>
          <div class="description">
            <p>${order.client.name.lastname}, ${order.client.name.firstname}</p>
            <p>${order.services[0].name} - ${order.services[0].unit_price},00 €/${order.services[0].type}</p>
          </div>
          <div class="extra">
            <div class="ui right floated content">
              <a href="/admin/orders/${order._id}" class="ui blue button"><i class="fa fa-search-plus" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
		`);
	});
	$(document).ready(function() {
		socket.emit("get-orders");
		socket.on("all-orders", function(allOrders) {
      $("#infoHeading").html("");
    $("#infoHeading").html(`Viimeisimmät varaukset`);
			allOrders.forEach(function(order) {
        console.log(order);
				$("#notificationList").append(`
					<div class="item">
          	<div class="ui tiny image">
          		<img src="/images/order.png">
        		</div>
        		<div class="middle aligned content">
          		<div class="header">
            		Varaus rekisterinumerolle ${order.client.register_number}
          		</div>
          		<div class="description">
           			<p>${order.client.name.lastname}, ${order.client.name.firstname}</p>
           			<p>${order.services.length !== 0 ? order.services[0].name : "Ei valittu"} - ${order.services.length !== 0 ? order.services[0].unit_price : 0},00 €/${order.services.length !== 0 ? order.services[0].type : "Ei valittu"}</p>
          		</div>
          		<div class="extra">
           			<div class="ui right floated content">
              		<a href="/admin/orders/${order._id}" class="ui blue button"><i class="fa fa-search-plus" aria-hidden="true"></i></a>
            		</div>
            	</div>
          	</div>
      		</div>
				`);
			});
		});
	});
});