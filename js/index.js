document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  var colorThief = new ColorThief();

  // When a yarn type is selected show the hidden elements.
  $('#yarnType').change(function() {
    if ($(this).val() != '') {
      $('.hidden').show()
    }
  });

  function openCamera(event) {

    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: event.data,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true
    }

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      var imageArray = {images: [
        {'file': imageUri}
      ]};
      var imageInputHtml = Mustache.to_html($('#image-section-template').html(), imageArray);
      $('#selected-image').prepend(imageInputHtml);
      addButtonHandlers(colorThief);

    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
  }

  // When a yarn type is selected show the hidden elements.
  $('#take-photo-button').click(Camera.PictureSourceType.CAMERA, openCamera);
  $('#select-image-button').click(Camera.PictureSourceType.PHOTOLIBRARY, openCamera);
}
