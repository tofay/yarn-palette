//Used to restore state when app in background - http://cordova.apache.org/docs/en/dev/guide/platforms/android/index.html#lifecycle-guide
var appState = {
  takingPicture: false,
  imageUri: "",
  yarn: "",
  numColours: ""
};

var APP_STORAGE_KEY = "yarnPaletteState";

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  var colorThief = new ColorThief();

  document.addEventListener("resume", onResume, false);
  document.addEventListener("pause", onPause, false);
  function onPause() {
    if (appState.takingPicture || appState.imageUri) {
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
    }
  }

  function onResume(event) {
    var storedState = window.localStorage.getItem(APP_STORAGE_KEY);

    if (storedState) {
      appState = JSON.parse(storedState);
    }

    if ($('#selected-image').hasClass("imageLoaded")) {
      return;
    }
    // Check to see if we need to restore an image we took
    if (!appState.takingPicture && appState.imageUri) {
      $('#yarnType option[value="' + appState.yarnType + '"').prop('selected', true).change()
      $('#numColours option[value = "' + appState.numColours + '"').prop('selected', true)
      displayImage(imageUri);
    }
    // Now we can check if there is a plugin result in the event object.
    else if (appState.takingPicture && event.pendingResult) {
      // Figure out whether or not the plugin call was successful and call
      // the relevant callback. For the camera plugin, "OK" means a
      // successful result and all other statuses mean error
      if (event.pendingResult.pluginStatus === "OK") {
        $('#yarnType option[value="' + appState.yarnType + '"').prop('selected', true).change()
        $('#numColours option[value = "' + appState.numColours + '"').prop('selected', true)
        cameraSuccess(event.pendingResult.result);
      } else {
        cameraFailure(event.pendingResult.result);
      }
    }
  }

  function displayImage(imageUri) {
    var imageArray = {
      images: [
        { 'file': imageUri }
      ]
    };
    var imageInputHtml = Mustache.to_html($('#image-section-template').html(), imageArray);
    $('#selected-image').prepend(imageInputHtml);
    $('#selected-image').addClass("imageLoaded");
    addButtonHandlers(colorThief);
  }

  function cameraSuccess(imageUri) {
    appState.takingPicture = false;
    appState.imageUri = imageUri;
    displayImage(imageUri);
  }

  function cameraError(error) {
    appState.takingPicture = false;
    appState.imageUri = "";
    console.debug("Unable to obtain picture: " + error, "app");
  }

  // When a yarn type is selected show the hidden elements.
  $('#yarnType').change(function() {
    if ($(this).val() != '') {
      $('.hidden').show()
    }
  });

  function openCamera(event) {
    appState.takingPicture = true;
    appState.yarnType = $('#yarnType').val();
    appState.numColours = $('#numColours').val();

    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: event.data,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true
    }

    navigator.camera.getPicture(cameraSuccess, cameraError, options);
  }

  // When a yarn type is selected show the hidden elements.
  $('#take-photo-button').click(Camera.PictureSourceType.CAMERA, openCamera);
  $('#select-image-button').click(Camera.PictureSourceType.PHOTOLIBRARY, openCamera);
}