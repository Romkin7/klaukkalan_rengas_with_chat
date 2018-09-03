$(document).ready(function() {
	//variables to hold the values of inputs, when validation of those inputs is passed.
	var client = {
		firstname: "",
		lastname: "",
		phonenumber: "",
		email: "",
		address: "",
		index: "",
		city: "",
		registernumber: ""
	};
	var errors = [];
	function showErrors() {
		$("#errors").html("");
		for(var i = 0; i < errors.length; i++) {
			$("#errors").append(`
				<div class="ui warning message">
              		<i class="close icon"></i>
              		<div class="header">
                		Virhe!
              		</div>
              		${errors[i]}
            	</div>
			`);
		}
	};
	$("#firstname").on("change", function() {
		var firstnameVal = $("#firstname").val();
		if(firstnameVal === "" || !/^[a-zA-Z]{2,30}$/.test(firstnameVal)) {
			$("#firstname").removeClass("success");
			client.firstname = "";
			if(errors.indexOf('Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.') === -1) {
				errors.push("Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.");
			}
			$("#firstname").addClass("error");
			$("#firstname").val("");
			showErrors();
		} else {
			$("#firstname").removeClass("error");
			$("#firstname").addClass("success");
			if(errors.indexOf('Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.') !== -1) {
				errors.splice(errors.indexOf('Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.'),1);
			}
			client.firstname = firstnameVal;
			checkValues();
			showErrors();
		}
	});
	$("#lastname").on("change", function() {
		var lastnameVal = $("#lastname").val();
		if(lastnameVal === "" || !/^[a-zA-Z]{2,30}$/.test(lastnameVal)) {
			$("#lastname").removeClass("success");
			client.lastname = "";
			if(errors.indexOf('Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.') === -1) {
				errors.push("Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.");
			}
			$("#lastname").addClass("error");
			$("#lastname").val("");
			showErrors();
		} else {
			$("#lastname").removeClass("error");
			$("#lastname").addClass("success");
			if(errors.indexOf('Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.') !== -1) {
				errors.splice(errors.indexOf('Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.'),1);
			}
			client.lastname = lastnameVal;
			checkValues();
			showErrors();
		}
	});
	$("#phone").on("change", function() {
		var phoneVal = $("#phone").val();
		if(phoneVal === "" || !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneVal)) {
			$("#phone").removeClass("success");
			client.phone = "";
			if(errors.indexOf('Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.') === -1) {
				errors.push("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.");
			}
			$("#phone").addClass("error");
			$("#phone").val("");
			showErrors();
		} else {
			$("#phone").removeClass("error");
			$("#phone").addClass("success");
			if(errors.indexOf('Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.') !== -1) {
				errors.splice(errors.indexOf('Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.'),1);
			}
			client.phone = phoneVal;
			checkValues();
			showErrors();
		}
	});
	$("#email").on("change", function() {
		var emailVal = $("#email").val();
		if(emailVal === "" || !/^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/.test(emailVal)) {
			$("#email").removeClass("success");
			client.email = "";
			if(errors.indexOf('Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.') === -1) {
				errors.push("Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.");
			}
			$("#email").addClass("error");
			$("#email").val("");
			showErrors();
		} else {
			$("#email").removeClass("error");
			$("#email").addClass("success");
			if(errors.indexOf('Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.') !== -1) {
				errors.splice(errors.indexOf('Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.'),1);
			}
			client.email = emailVal;
			checkValues();
			showErrors();
		}
	});
	$("#street").on("change", function() {
		var streetVal = $("#street").val();
		if(streetVal === "" || !/^[a-zA-Z0-9" "]{8,30}$/.test(streetVal)) {
			$("#street").removeClass("success");
			client.street = "";
			if(errors.indexOf('Antamanne katuosoite on virheellinen.') === -1) {
				errors.push("Antamanne katuosoite on virheellinen.");
			}
			$("#street").addClass("error");
			$("#street").val("");
			showErrors();
		} else {
			$("#street").removeClass("error");
			$("#street").addClass("success");
			if(errors.indexOf('Antamanne katuosoite on virheellinen.') !== -1) {
				errors.splice(errors.indexOf('Antamanne katuosoite on virheellinen.'),1);
			}
			client.street = streetVal;
			checkValues();
			showErrors();
		}
	});
	$("#city").on("change", function() {
		var cityVal = $("#city").val();
		if(cityVal === "" || !/^[a-zA-Z]{2,30}$/.test(cityVal)) {
			$("#city").removeClass("success");
			client.city = "";
			if(errors.indexOf('Antamanne paikkakunta on virheellinen.') === -1) {
				errors.push("Antamanne paikkakunta on virheellinen.");
			}
			$("#city").addClass("error");
			$("#city").val("");
			showErrors();
		} else {
			$("#city").removeClass("error");
			$("#city").addClass("success");
			if(errors.indexOf('Antamanne paikkakunta on virheellinen.') !== -1) {
				errors.splice(errors.indexOf('Antamanne paikkakunta on virheellinen.'),1);
			}
			client.city = cityVal;
			checkValues();
			showErrors();
		}
	});
	$("#index").on("change", function() {
		var indexVal = $("#index").val();
		if(indexVal === "" || !/^[0-9]{5}$/.test(indexVal)) {
			$("#index").removeClass("success");
			client.index = "";
			if(errors.indexOf('Antamanne postinumero on virheellinen.') === -1) {
				errors.push("Antamanne postinumero on virheellinen.");
			}
			$("#index").addClass("error");
			$("#index").val("");
			showErrors();
		} else {
			$("#index").removeClass("error");
			$("#index").addClass("success");
			if(errors.indexOf('Antamanne postinumero on virheellinen.') !== -1) {
				errors.splice(errors.indexOf('Antamanne postinumero on virheellinen.'),1);
			}
			client.index = indexVal;
			checkValues();
			showErrors();
		}
	});
	// Car detail validation
	$("#registernumber").on("change", function() {
		var registernumberVal = $("#registernumber").val();
		if(registernumberVal === "" || !/^[A-Z]{3}?[-]{1}?[0-9]{3}$/.test(registernumberVal)) {
			$("#registernumber").removeClass("success").addClass("error");
			client.registernumber = "";
			if(errors.indexOf('Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia.') === -1) {
				errors.push("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia.");
			}
			$("#registernumber").val("");
			showErrors();
		} else {
			$("#registernumber").removeClass("error").addClass("success");
			client.registernumber = registernumberVal;
			if(errors.indexOf('Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia.') !== -1) {
				errors.splice(errors.indexOf("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia."),1);
			}
			client.registernumber = registernumberVal;
			checkValues();
			showErrors();
		}
	});
	//Check for data precistance 
	function checkValues() {
		if(client.firstname !== "" && client.lastname !== "" && client.email !== "" && client.phone !== "" && client.registernumber !== "") {
			$("#submitBtn").prop("disabled", false);
		} else {
			$("#submitBtn").prop("disabled", true);
		}
	};
});
