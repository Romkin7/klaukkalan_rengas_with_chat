$(document).ready(function() {
	$("#toggle").click(function() {
  	 $('.ui.left.vertical.orange.sidebar.menu')
  		.sidebar('toggle');
  		$('html, body').animate({ scrollTop: 0 }, 'medium');
  	});
	$('.ui.dropdown').dropdown();
	$('.menu .item').tab();
});