/**
 * Calculate colour distance using http://zschuessler.github.io/DeltaE/learn/#toc-delta-e-2000
 * 
 * @param  {int[]} rgb1 - RGB colour.
 * @param  {int[]} rgb2 = RGB colour.
 */
function cielab_distance_2000(rgb1, rgb2) {
  var lab1 = d3.lab(d3.rgb(rgb1[0], rgb1[1], rgb1[2]));
  var lab2 = d3.lab(d3.rgb(rgb2[0], rgb2[1], rgb2[2]));
  return DeltaE.getDeltaE00({L: lab1.l, A: lab1.a, B: lab1.b},
                            {L: lab2.l, A: lab2.a, B: lab2.b});
}

/**
 * Determines the index of the colour in an array of colours that is
 * closest to a specified query colour.
 * 
 * @param  {int[][]} colours - An array of RGB colour points.
 * @param  {int[]} query - RGB colour point.
 */
function nearestNeighbour(colours, query) {
  // Get the distance from the query_point to each of the points.
  var distances = colours.map(function(x) {
    return cielab_distance_2000(x, query);
  });

  // The accumulator is the index of the smallest item.
  return distances.reduce(function(acc, val, idx, arr) {
    return val < arr[acc] ? idx : acc;
  }, 0);
}

function pickYarns($imageSection, colorThief) {
  var image = $imageSection.find('img')[0];
  var palette = colorThief.getPalette(image, parseInt($('#numColours').val()));
  var yarnRange = window[$('#yarnType').val()];
  var colours = yarnRange.map(function(x) {return x[2]});
  var yarns = palette.map(function(x) {
   return yarnRange[nearestNeighbour(colours, x)]
  }).filter(function(elem, pos, arr) {
    return arr.indexOf(elem) == pos; //Filter out duplicates
  });

  var context = {
    palette: palette,
    yarns: yarns
  };
  var outputHtml = Mustache.to_html($('#yarn-palette-template').html(), context);
  $imageSection.find('.yarn-palette').empty().prepend(outputHtml);
}

// Event handlers for buttons
function addButtonHandlers(colorThief) {
  $('.pick-colours-button').unbind().click(function(event) {
    var $imageSection = $(this).closest('.image-section');
    pickYarns($imageSection, colorThief);
  });
}

// Display the image when the user selects it
function displayImage(input, colorThief) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var imageArray = {images: [
        {'file': e.target.result}
      ]};
      var imageInputHtml = Mustache.to_html($('#image-section-template').html(), imageArray);
      $('#selected-image').prepend(imageInputHtml);
      addButtonHandlers(); // Lazy... only need to add handler for new button
    }
    reader.readAsDataURL(input.files[0]);
  }
}