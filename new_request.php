<?php
	require_once 'include/config.php';
	require_once 'requests.php';

	$url = "https://api.at.govt.nz/v2/public/realtime/vehiclelocations";
	$route = $_GET['route'];

	#sanitize $route before query
	$route = sanitize_string($route);

	function sanitize_string($string) {
		$string = htmlspecialchars($string);
		$string = strip_tags($string);
		return $string;
	}

	// ----------------- MYSQL QUERY PART ----------------------
	$conn = new mysqli($hostname, $username, $password, $database);
	if ($conn->connect_error) die($conn->connect_error);

	// Prepare the query to be sent to the database
	if (!($query = $conn->prepare("SELECT trip_id FROM trips WHERE route_id in 
		(SELECT route_id FROM routes WHERE route_short_name = ?)"))) {
		print "Prepare query statement failed: " . $conn->error;
	}

	// Insert the $route variable into the query where the '?' is,
	// the "s" tells the function the variable is a string
	if (!$query->bind_param("s", $route)) {
		print "Binding parameters failed: " . $query->error;
	}

	// Send the query to the database
	if (!$query->execute()) {
		print "Execute failed: " . $query->error;
	}

	// Choose what variable to send the result to (only get one
	// result at a time (as far as I know))
	$query->bind_result($singleQueryResult);

	// Get all the results back and put them into the trip_ids array
	$trip_ids = array();
	while ($query->fetch()) {
		$trip_ids[] = $singleQueryResult;
	}

	// ---------------------------------------------------------



	// -------------------- API CALL ---------------------------
	// Prepare the parameters for the API call...

	// There is a limited about of variables you can send to the API
	// in the URL, so sending the list of trip_ids from the query just
	// before won't work.
	// So we query the API for all vehicles current running and that
	// sends back a big array stuff. Then we sort through it all and
	// compare the reults of the API query with the results of the MYSQL
	// query and that leaves us with all the current vehicles that are
	// currently on the route from our given short_route_name (eg 550)

	// There may be a better way to do this but I don't know at the mo.

	$params = array();

	$results = apiCall($APIKey, $url, $params);
	header('Content-Type: application/json');

	// Decode the response so we can process it
	$decoded = json_decode($results[0]);

	// ---------------------------------------------------------

	// ------------------- SORTING RESULTS ---------------------

	// The final array of objects to "return" (we just echo it)
	$vehicles = array(); 

	// Cycle through the returned list of vehicles and match them with
	// the ones found from the MYSQL query
	// These matched results are the entities that have 
	// the route_short_name (eg 550) that we want
	for ($i = 0; $i < count($decoded->response->entity); $i++) {
		$tempid = $decoded->response->entity[$i]->vehicle->trip->trip_id;
		$entity = $decoded->response->entity[$i];
		if (in_array($tempid, $trip_ids)) {
			array_push($vehicles, $entity);
		}
	}

	echo json_encode($vehicles);
	// ---------------------------------------------------------

?>

