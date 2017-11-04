/**
 * Calculates the square of the Euclidean distance between 2 points.
 */
function distance(p1, p2) {
  return p1.reduce(function(acc, val, idx) {
    return acc + Math.pow(val - p2[idx], 2);
  }, 0);
}

/*
 * Using formula from https://www.compuphase.com/cmetric.htm
 */
function weighted_distance(p1, p2) {
  var mean_red = (p1[0] + p2[0]) / 2;
  var weights = [2 + (mean_red/256), 4, 2 + (255-mean_red)/256];
  return weights.reduce(function(acc, val, idx) {
    return acc + val * Math.pow(p1[idx] - p2[idx], 2);
  }, 0);
}

/**
 * Determines the index of the closest point in an array of points that is
 * closest to some query point.
 */
function nearestNeighbour(points, queryPoint) {
  // Get the distance from the query_point to each of the points.
  var distances = points.map(function(x) {
    return weighted_distance(x, queryPoint)
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