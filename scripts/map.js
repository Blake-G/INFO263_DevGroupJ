var map;
var markers = [];


function initMap() {
	// var uluru = {lat: -25.363, lng: 131.044};
	var auck = {lat: -36.8485, lng: 174.7633};
	var auck2 = {lat: -36.8495, lng: 174.7643};
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13,
	  center: auck
	});
	// var marker = new google.maps.Marker({
	//   position: auck,
	//   map: map
	// });
	// new google.maps.Marker({
	//   position: auck2,
	//   map: map
	// });
}

// Adds marker to the map and push to the array of markers
function addMarker(location, title) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		title: title
	});
	markers.push(marker);
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
	$.get("new_request.php", "route="+route_code, function(response, status, xhr) {
		
		// Alert message if it worked or not, don't need after debugging finished
		// if (status == "success") {
		// 	alert("External content was loaded successfully!");
		// }
		if (status == "error") {
			alert("Error: " + xhr.status + ": " + xhr.statusText);
		}

		if (response['response'] == null) {
			deleteMarkers();
			console.log(response['response']); // double checked in console
		} else {

			// Delete the old markers before we get the new markers
			deleteMarkers();

			console.log(response); // Console output for debugging / manually checking positions.

			var resLen = response['response']['entity']['length'];
			var pos, myLat, myLng;

			// Place a new marker for each... bus?
			for (var i = 0; i < resLen; i++) {
				pos = response['response']['entity'][i]['vehicle']['position'];
				myLat = pos['latitude'];
				myLng = pos['longitude'];
				vehicleId = response['response']['entity'][i]['vehicle']['vehicle']['id'];
				title = "Vehicle ID: [" + vehicleId + "]";
				addMarker({lat: myLat, lng: myLng}, title);
			}

			// Adjust the map so all markers are visible on it
			if (!isAuto) {
				adjustMapBounds();
			}
		}

	});
}