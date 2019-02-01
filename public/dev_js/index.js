$(document).ready(function() {
	$("#toggle").click(function() {
  	 $('.ui.left.vertical.orange.sidebar.menu')
  		.sidebar('toggle');
  		$('html, body').animate({ scrollTop: 0 }, 'medium');
  	});
	$('.ui.dropdown').dropdown();
	$('.menu .item').tab();
	//open tyre category menu
	$("#tyre-caterogy").on("click", function(event) {
		$("#tyre-caterogy_menu").slideToggle(1000);
	});
	$('.message .close')
  		.on('click', function() {
    		$(this)
      		.closest('.message')
      		.transition('fade')
    		;
  		})
	;
	//Open tyre size menu
	$(".open-slidedown_menu").on("click", function(event) {
		var menuId = this.getAttribute("toggle-data");
		if($(this).hasClass("active")) {
			$(`#${menuId}`).slideUp(1000);
			this.classList.remove("active");
		} else {
			$(".open-slidedown_menu").removeClass("active");
			this.classList.add("active");
			$(".slide-menu").slideUp(500);
			$(`#${menuId}`).slideDown(1000);
		}
	});
});