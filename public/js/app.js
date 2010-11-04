String.prototype.lpad = function(padString, length) {
	var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function randomLat() {
  return Math.random() * 13 + 18;
}

function randomLng() {
  return -(Math.random() * 13 + 65);
}

function randomTriangle() {
  return [
      new google.maps.LatLng(randomLat(), randomLng()),
      new google.maps.LatLng(randomLat(), randomLng()),
      // new google.maps.LatLng(randomLat(), randomLng()),
      new google.maps.LatLng(randomLat(), randomLng())
  ];
}

function random255Hex() {
  return Math.floor(Math.random() * 255).toString(16);
}

function randomColor() {
  return "#" + random255Hex() + random255Hex() + random255Hex();
}

function addTriangle(map) {
   // Construct the polygon
   bermudaTriangle = new google.maps.Polygon({
     paths: randomTriangle(),
     strokeColor: randomColor(),
     strokeOpacity: 0.8,
     strokeWeight: 2,
     fillColor: randomColor(),
     fillOpacity: 0.35
   });

  bermudaTriangle.setMap(map);
}

function directionsUrl(start, end) {
  api_base = 'http://maps.googleapis.com/maps/api/directions/json';
  return api_base + '?origin=' + start.lat() + ',' + start.lng() +
     '&destination=' + end.lat() + ',' + end.lng() +
     '&sensor=false&mode=walking';
}

function drawLine(map, start, end, color) {
  var line = new google.maps.Polyline({
    path: [start, end],
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 5
  });
  line.setMap(map);
};

function processStreet(map, street) {
  if(street.AntalKl12 >= 0) {
    if(street.StartAdresse && street.StartAdresse.LngLat) {
      var start = new google.maps.LatLng(street.StartAdresse.LngLat.Lat,
                                         street.StartAdresse.LngLat.Lon);
      var end = new google.maps.LatLng(street.SlutAdresse.LngLat.Lat,
                                       street.SlutAdresse.LngLat.Lon);
      var daekning = Math.min(1, (street.AntalKl12 / street.TotalPladser) - 0.3);
      var red = Math.floor(daekning * 255).toString(16).lpad('0', 2);
      var green = Math.floor((1 - daekning) * 255).toString(16).lpad('0', 2);
      var color = "#" + red + green + "00";
      // console.log(daekning);
      // console.log(red);
      // console.log(green);
      // console.log('-------------');
      // console.log(color)
      // console.log('-------------');
      drawDirections(map, street, color);
    } else {
      console.log('No start address');
    }
  } else {
    console.log("Nobody at 12");
  }
}

function drawPolyline(map, polyline, color) {
  var steps = decodeLine(polyline.points);
  for(var step_count = 0; step_count < steps.length-1; step_count++ ) {
    var start_location = steps[step_count];
    var end_location = steps[step_count+1];
    var start = new google.maps.LatLng(start_location[0],
                                       start_location[1]);
    var end = new google.maps.LatLng(end_location[0],
                                     end_location[1]);
    drawLine(map, start, end, color);
  }
}

function drawDirections(map, street, color) {
  if(street.TotalPladser > 0) {
    if(street.directions.routes[0]) {
      // console.log(street);
      console.log(street.directions.routes[0].overview_polyline);
      var polyline = street.directions.routes[0].overview_polyline;
      // console.log(color);
      drawPolyline(map, polyline, color);
    } else {
      console.log('no route');
    }
  } else {
    console.log('----');
  }
}

function initialize() {
  var kattesundet_1 = new google.maps.LatLng(55.6776014423565,
                                             12.5705311210751);
  var hoejbro_plads = new google.maps.LatLng(55.6783941,
                                             12.5802399);
  var myLatLng = hoejbro_plads;
  var myOptions = {
    zoom: 15,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"),
      myOptions);
  for(var street_no = 0; street_no < data.length; street_no++) {
    console.log(street_no);
    processStreet(map, data[street_no]);
  }
}
