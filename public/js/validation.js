$(document).ready(function(){var e={firstname:"",lastname:"",phonenumber:"",email:"",address:"",index:"",city:"",registernumber:""},a=[];function n(){$("#errors").html("");for(var e=0;e<a.length;e++)$("#errors").append(`\n\t\t\t\t<div class="ui warning message">\n              \t\t<i class="close icon"></i>\n              \t\t<div class="header">\n                \t\tVirhe!\n              \t\t</div>\n              \t\t${a[e]}\n            \t</div>\n\t\t\t`)}function i(){""!==e.firstname&&""!==e.lastname&&""!==e.email&&""!==e.phone&&""!==e.registernumber?$("#submitBtn").prop("disabled",!1):$("#submitBtn").prop("disabled",!0)}$("#firstname").on("change",function(){var s=$("#firstname").val();""!==s&&/^[a-zA-Z]{2,30}$/.test(s)?($("#firstname").removeClass("error"),$("#firstname").addClass("success"),-1!==a.indexOf("Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.")&&a.splice(a.indexOf("Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z."),1),e.firstname=s,i(),n()):($("#firstname").removeClass("success"),e.firstname="",-1===a.indexOf("Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z.")&&a.push("Etunimen on oltava vähintään 2 merkkiä pitkä ja se voi sisältää vain kirjaimia a-z."),$("#firstname").addClass("error"),$("#firstname").val(""),n())}),$("#lastname").on("change",function(){var s=$("#lastname").val();""!==s&&/^[a-zA-Z]{2,30}$/.test(s)?($("#lastname").removeClass("error"),$("#lastname").addClass("success"),-1!==a.indexOf("Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.")&&a.splice(a.indexOf("Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z."),1),e.lastname=s,i(),n()):($("#lastname").removeClass("success"),e.lastname="",-1===a.indexOf("Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z.")&&a.push("Sukunimen vähimmäis pituus on 2 merkkiä ja se voi sisältää vain kirjaimia a-z."),$("#lastname").addClass("error"),$("#lastname").val(""),n())}),$("#phone").on("change",function(){var s=$("#phone").val();""!==s&&/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(s)?($("#phone").removeClass("error"),$("#phone").addClass("success"),-1!==a.indexOf("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.")&&a.splice(a.indexOf("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia."),1),e.phone=s,i(),n()):($("#phone").removeClass("success"),e.phone="",-1===a.indexOf("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia.")&&a.push("Antamanne puhelinnumero, ei vastaa Suomen virallista puhelinnuero formaattia."),$("#phone").addClass("error"),$("#phone").val(""),n())}),$("#email").on("change",function(){var s=$("#email").val();""!==s&&/^[a-zA-Z0-9\_\-\.]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,4}$/.test(s)?($("#email").removeClass("error"),$("#email").addClass("success"),-1!==a.indexOf("Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.")&&a.splice(a.indexOf("Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia."),1),e.email=s,i(),n()):($("#email").removeClass("success"),e.email="",-1===a.indexOf("Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia.")&&a.push("Antamanne sähköpostiosoite, ei vastaa virallista sähköpostiosoitteen formaattia."),$("#email").addClass("error"),$("#email").val(""),n())}),$("#street").on("change",function(){var s=$("#street").val();""!==s&&/^[a-zA-Z0-9" "]{8,30}$/.test(s)?($("#street").removeClass("error"),$("#street").addClass("success"),-1!==a.indexOf("Antamanne katuosoite on virheellinen.")&&a.splice(a.indexOf("Antamanne katuosoite on virheellinen."),1),e.street=s,i(),n()):($("#street").removeClass("success"),e.street="",-1===a.indexOf("Antamanne katuosoite on virheellinen.")&&a.push("Antamanne katuosoite on virheellinen."),$("#street").addClass("error"),$("#street").val(""),n())}),$("#city").on("change",function(){var s=$("#city").val();""!==s&&/^[a-zA-Z]{2,30}$/.test(s)?($("#city").removeClass("error"),$("#city").addClass("success"),-1!==a.indexOf("Antamanne paikkakunta on virheellinen.")&&a.splice(a.indexOf("Antamanne paikkakunta on virheellinen."),1),e.city=s,i(),n()):($("#city").removeClass("success"),e.city="",-1===a.indexOf("Antamanne paikkakunta on virheellinen.")&&a.push("Antamanne paikkakunta on virheellinen."),$("#city").addClass("error"),$("#city").val(""),n())}),$("#index").on("change",function(){var s=$("#index").val();""!==s&&/^[0-9]{5}$/.test(s)?($("#index").removeClass("error"),$("#index").addClass("success"),-1!==a.indexOf("Antamanne postinumero on virheellinen.")&&a.splice(a.indexOf("Antamanne postinumero on virheellinen."),1),e.index=s,i(),n()):($("#index").removeClass("success"),e.index="",-1===a.indexOf("Antamanne postinumero on virheellinen.")&&a.push("Antamanne postinumero on virheellinen."),$("#index").addClass("error"),$("#index").val(""),n())}),$("#registernumber").on("change",function(){var s=$("#registernumber").val();""!==s&&/^[A-Z]{3}?[-]{1}?[0-9]{3}$/.test(s)?($("#registernumber").removeClass("error").addClass("success"),e.registernumber=s,-1!==a.indexOf("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia.")&&a.splice(a.indexOf("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia."),1),e.registernumber=s,i(),n()):($("#registernumber").removeClass("success").addClass("error"),e.registernumber="",-1===a.indexOf("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia.")&&a.push("Antamanne ajoneuvon rekisterinumero, ei vastaa Suomen virallista ajoneuvon rekisterinumero formaattia."),$("#registernumber").val(""),n())})});