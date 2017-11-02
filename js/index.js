$(document).ready(function() {
  var colorThief = new ColorThief();

  /*
   * Example rendering taken from color-thief. Copyright (c) 2015 Lokesh Dhakar
   */
  var imageArray = {images: [
    {'file': 'img/examples/photo1.jpg'},
    {'file': 'img/examples/photo2.jpg'},
    {'file': 'img/examples/photo3.jpg'}
  ]};
  var examplesHTML = Mustache.to_html($('#image-section-template').html(), imageArray);
  $('#example-images').append(examplesHTML);

  // Event handlers for buttons
  function addButtonHandlers(colorThief) {
    $('.pick-colours-button').unbind().click(function(event) {
      var $imageSection = $(this).closest('.image-section');
      pickYarns($imageSection, colorThief);
    });
  }

  addButtonHandlers(colorThief);

  // When a yarn type is selected show the hidden elements.
  $('#yarnType').change(function() {
    if ($(this).val() != '') {
      $('.hidden').show()
    }
  });

  // Display the image when the user selects it
  function displayImage(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var imageArray = {images: [
          {'file': e.target.result}
        ]};
        var imageInputHtml = Mustache.to_html($('#image-section-template').html(), imageArray);
        $('#selected-image').prepend(imageInputHtml);
        addButtonHandlers(colorThief); // Lazy... only need to add handler for new button
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#image-input").change(function(){
      displayImage(this);
  });
});
