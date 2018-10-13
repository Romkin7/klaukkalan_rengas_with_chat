document.addEventListener("DOMContentLoaded", function() {
	var _URL = window.URL || widndow.webkitURL;
	if(window.location.pathname === "/portfolio/new") {
		function setErrorMsg(msgCase, message) {
			return `
				<div class="ui warning message">
					<i class="close icon"></i>
					<div class="header">
						${msgCase}!
					</div>
					${message}
				</div>
			`;
		};
		var imageInput = document.querySelector("#imageInput");
		var imageView = document.querySelector("#imageView");
		var fileUploadButton = document.getElementById("custom-file-upload");
		var imagePreviewContainer = document.querySelector("#imagePreviewContainer");
		var messages = document.querySelector("#messages");
		var aspectRatioButtons = document.querySelector("#aspectRatioButtons");
		var ratioBtns = document.querySelectorAll(".ratioBtn");
		var ratio = 1/1;
		var width = 400;
		var height = 400;
		//Listen for event to get aspect ratio of cropperjs
		for(var i = 0; i < ratioBtns.length; i++) {
			ratioBtns[i].addEventListener("click", function(event) {
				event.preventDefault();
				ratio = this.getAttribute("ratio");
				width = Number(this.getAttribute("width"));
				height = Number(this.getAttribute("height"));
				cropImage(ratio, width, height);
			});
		}
		// Listen for change input state event, to create new filereader and open cropper for validated image.
		imageInput.addEventListener("change", function(event) {
			if(sizeValid(this, 3000000) && typeValid("imageInput")) {
				messages.innerHTML = "";
				var reader = new FileReader();
				console.log(reader);
				reader.onload = function(event) {
					imageView.src = event.target.result;
					imageView.onload = function() {
						fileUploadButton.classList.toggle("hidden");
						imagePreviewContainer.classList.toggle("hidden");
						aspectRatioButtons.classList.toggle("hidden");
						cropImage(ratio, width, height);
					}
				}
				reader.readAsDataURL(this.files[0]);
			}
		});
		//Validate file Size
		function sizeValid(self, size) {
			if(self.files[0].size > size) {
				reset();
				messages.innerHTML = `${setErrorMsg("Внимание", "Максимальный размер фотографии является 3МБ.")}`;
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
				reset();
				messages.innerHTML = `${setErrorMsg("Внимание", "Формат фотографии не разрешен. Фотографии могут быть формата jpg, jpeg, png или gif.")}`;
				return false;
			} else {
				return true;
			}
		}
		//Crop image
		function cropImage(aspect, minW, minH) {
			$("#imageView").cropper("destroy").cropper({
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
			messages.innerHTML = "";
			imageInput.value = "";
		};
	}
});