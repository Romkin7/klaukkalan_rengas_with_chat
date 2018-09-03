$(document).ready(function() {
	$(".henkiloauto").hide();
	$(".c-ll").hide();
	$(".suv").hide();
	$("#car_type").on("change", function(event) {
		var car_type = $("#car_type").val();
		console.log(car_type);
		if(car_type === "Henkilöauto") {
			$(".henkiloauto").show();
			$(".c-ll").hide();
			$(".suv").hide();
		}
		if(car_type === "SUV") {
			$(".suv").show();
			$(".henkiloauto").hide();
			$(".c-ll").hide();
		}
		if(car_type === "C-LL") {
			$(".henkiloauto").hide();
			$(".c-ll").show();
			$(".suv").hide();
		}
	});
	$('.special.cards .image').dimmer({
  		on: 'hover'
	});
});