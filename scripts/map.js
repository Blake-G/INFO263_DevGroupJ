var map;
var markers = [];


function initMap() {
	var auck = {lat: -36.8485, lng: 174.7633};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13,
	  center: auck
	});
}

function resetMap() {
	var auck = {lat: -36.8485, lng: 174.7633};
	map.setZoom(13);
	map.setCenter(auck);
}

// Adds marker to the map and push to the array of markers
function addMarker(location, title, contentString) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: title
	});
	markers.push(marker);

	var infowindow = new google.maps.InfoWindow({
    	content: contentString
    });

	marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}


// Removes the markers from the amp. but keeps them in the array
function clearMarkers() {
	setMapOnAll(null);
}


// Sets the map on all markers in the array
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}


// Shows any markers currently in the array (?)
function showMarkers() {
	setMapOnAll(map);
}


// Deletes all markers in the array
function deleteMarkers() {
	clearMarkers();
	markers = [];
}


// Adjust the map to show all markers on the map
function adjustMapBounds() {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
		bounds.extend(markers[i].getPosition());
	}
	map.fitBounds(bounds);
}


function updateMap(route_code, isAuto) {
	// this used to be "new_reqeust.php", changed to my one for debugging
	$.get("new_reqeust.php", "route="+route_code, function(response, status, xhr) {
		
		if (status == "error") {
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		} 

		else if (status == "success") {

			if (response['length'] == 0) {
				// If there is no results, reset the map
				deleteMarkers();
				console.log(response);
				resetMap();
				// want to stop autorefresh here too
			} 

			else if (response == null) {
				// There is something pretty wrong, this shouldn't happen
				console.log("There is something very wrong (" + response + ")");
			} 

			else {
				// Delete the old markers before we get the new markers
				deleteMarkers();

				// Console output for debugging / manually checking positions.
				console.log(response);

				var resLen = response['length'];
				var pos, myLat, myLng, vehicleId, title, contentString;

				// Place a new marker for each... bus?
				for (var i = 0; i < resLen; i++) {
					pos = response[i]['vehicle']['position'];
					myLat = pos['latitude'];
					myLng = pos['longitude'];
					vehicleId = response[i]['vehicle']['vehicle']['id'];
					title = "Vehicle ID: [" + vehicleId + "]";
					vehicleInfo = response[i];
					contentString = getContentString(vehicleInfo);
					addMarker({lat: myLat, lng: myLng}, title, contentString);
				}

				// Adjust the map so all markers are visible on it
				if (!isAuto) {
					adjustMapBounds();
				}
			}
		}
		else {
			// This shouldn't be possible to get here.
		}
	});
}


// Pull out all the parts of the vehicle information and assembles
// them into a string for the info window
// TODO: I'm sure more info can be added or made prettier.
function getContentString(vehicleInfo) {
	id = vehicleInfo['id'];
	lat = vehicleInfo['vehicle']['position']['latitude'];
	long = vehicleInfo['vehicle']['position']['longitude'];
	routeId = vehicleInfo['vehicle']['trip']['route_id'];
	startTime = vehicleInfo['vehicle']['trip']['start_time'];
	tripId = vehicleInfo['vehicle']['trip']['trip_id'];
	vehicleId = vehicleInfo['vehicle']['vehicle']['id'];

	contentString = 
	'<div id="content">' +
	'<div id="bodyContent">' +
	'<h4><b>Vehicle Information</b></h4><br>' +
	'<p>' +
	'Vehicle ID: ' + vehicleId + '<br>' +
	'Start Time: ' + startTime + '<br>' +
	'Location: (' + lat + ', ' + long + ')<br>' +
	'Route ID: ' + routeId + '<br>' +
	'Trip ID: ' + tripId + '<br>' +
	'Entity ID: ' + id + '<br>' +
	'</p></div></div>';

	return contentString;
}