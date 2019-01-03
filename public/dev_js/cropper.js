document.addEventListener("DOMContentLoaded", function() {
	var _URL = window.URL || widndow.webkitURL;
	if(window.location.pathname === "/admin/products/new") {
		function scrollTop() {
      		return $('html, body').animate({ scrollTop: 0 }, 'medium');
    	};
		function setErrorMsg(msgCase, message, status) {
			return `
				<div class="ui ${status} message">
					<i class="close icon"></i>
					<div class="header">
						${msgCase}!
					</div>
					${message}
				</div>
			`;
		};
		var imageInput = document.querySelector("#cover");
		var imageView = document.querySelector("#imgPreview");
		var fileUploadButton = document.querySelector(".custom-file-upload");
		var imgPreviewContainer = document.querySelector("#imgPreviewContainer");
		var messages = document.querySelector("#messages");
		var aspectRatioButtons = document.querySelector("#aspectRatioButtons");
		var ratioBtns = document.querySelectorAll(".ratioBtn");
		var imageSelectionBtns = document.getElementById("imgBtns");
		var ratio = 1/1;
		var width = 400;
		var height = 400;
		//Listen for event to get aspect ratio of cropperjs
		for(var i = 0; i < ratioBtns.length; i++) {
			ratioBtns[i].addEventListener("click", function(event) {
				event.preventDefault();
				console.log(this);
				ratio = this.getAttribute("ratio");
				width = Number(this.getAttribute("width"));
				height = Number(this.getAttribute("height"));
				cropImage(ratio, width, height);
			});
		}
		// Listen for change input state event, to create new filereader and open cropper for validated image.
		imageInput.addEventListener("change", function(event) {
			if(sizeValid(this, 3000000) && typeValid("cover")) {
				messages.innerHTML = "";
				var reader = new FileReader();
				reader.onload = function(event) {
					imageView.src = event.target.result;
					imageView.onload = function() {
						fileUploadButton.classList.toggle("hidden");
						imgPreviewContainer.classList.toggle("hidden");
						aspectRatioButtons.classList.toggle("hidden");
						imageSelectionBtns.classList.toggle("hidden");
						cropImage(ratio, width, height);
					}
				}
				reader.readAsDataURL(this.files[0]);
			}
		});
		//Validate file Size
		function sizeValid(self, size) {
			if(self.files[0].size > size) {
				imageInput.value = "";
				messages.innerHTML = `${setErrorMsg("Внимание", "Максимальный размер фотографии является 3МБ.", "warning")}`;
				return false;
			} else {
				return true;
			}
		};
		//Validate file type
		function typeValid(id) {
			var id = id;
			var type = document.getElementById(id).files[0].type;
			type = type.toString();
			if(type !== "image/jpg" && type !== "image/png" && type !== "image/jpeg" && type !== "image/bmp") {
				imageInput.value = "";
				messages.innerHTML = `${setErrorMsg("Внимание", "Формат фотографии не разрешен. Фотографии могут быть формата jpg, jpeg, png или gif.", "warning")}`;
				return false;
			} else {
				return true;
			}
		}
		//Crop image
		function cropImage(aspect, minW, minH) {
			$("#imgPreview").cropper("destroy").cropper({
				aspectRatio: aspect,
				viewMode: 1,
				responsive: true,
				background: true,
				modal: false,
				zoomable: true,
				zoomOnTouch: true,
				cropBoxResizable: true,
				minCropBoxWidth: minW,
	      		minCropBoxHeight: minH,
	      		ready: function() {
	      		}
			});
		};
		//function to reset image selection
		function reset() {
			scrollTop();
			messages.innerHTML = "";
			imageInput.value = "";
			$('#imgPreview').cropper('destroy');
    		$("#imgPreview").removeAttr("src");
    		fileUploadButton.classList.toggle("hidden");
			imgPreviewContainer.classList.toggle("hidden");
			aspectRatioButtons.classList.toggle("hidden");
			imageSelectionBtns.classList.toggle("hidden");
		};
		//Submit image
		$("#submitImage").on("click", function(event) {
			event.preventDefault();
			cover = $("#imgPreview").cropper("getData", true);
			$.post("/admin/products/cropperdata", cover, function(response) {
				if(response === "success") {
					$("#imgPreview").cropper("destroy");
					$("#imgPreview").removeAttr("src");
					fileUploadButton.classList.toggle("hidden");
					imgPreviewContainer.classList.toggle("hidden");
					aspectRatioButtons.classList.toggle("hidden");
					imageSelectionBtns.classList.toggle("hidden");
					$("#imageInput").prop("disabled", true);
					scrollTop();
					messages.innerHTML = `${setErrorMsg("Onnistui!", "Kuva on onnistuneesti lähetetty palvelimelle.", "success")}`;
				} else {
					return;
				}
			});
		});
		//Reset image event
		$("#resetImage").on("click", function(event) {
			event.preventDefault();
			reset();
		});
	}
});