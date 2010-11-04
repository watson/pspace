// These functions decode a polyline pointstring.
// The first is mine and simply links the second function to the form.
function decode () {
  var instring;
  var outstring;
  var points;
  
  instring = document.getElementById("polylineDecoder").encodedPolylineIn.value;
  instring = instring.replace(/\\\\/g, "\\");
  points = decodeLine(instring);
  outstring = "";
  for(i=0; i < points.length; i++) {
    outstring = outstring + points[i][0] + ", " + points[i][1] + "\n";
  }
  document.getElementById("polylineDecoder").decodedPolylineOut.value = outstring;
}

// This function is from Google's polyline utility.
function decodeLine (encoded) {
  var len = encoded.length;
  var index = 0;
  var array = [];
  var lat = 0;
  var lng = 0;

  while (index < len) {
    var b;
    var shift = 0;
    var result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    array.push([lat * 1e-5, lng * 1e-5]);
  }

  return array;
}
