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

	// ----------------- MYSQL QUERY PART -----------------------------
	$conn = new mysqli($hostname, $username, $password, $database);
	if ($conn->connect_error) die($conn->connect_error);

	if (!($query = $conn->prepare("SELECT trip_id FROM trips WHERE route_id in 
		(SELECT route_id FROM routes WHERE route_short_name = ?)"))) {
		print "Prepare query statement failed: " . $conn->error;
	}

	if (!$query->bind_param("s", $route)) {
		print "Binding parameters failed: " . $query->error;
	}

	if (!$query->execute()) {
		print "Execute failed: " . $query->error;
	}

	// $queryResult;
	$query->bind_result($singleQueryResult);

	$queryResult = array();
	while ($query->fetch()) {
		$queryResult[] = $singleQueryResult;
	}

	// echo $query . "\n";
	// var_dump($queryResult);

	// $query = "SELECT trip_id FROM trips WHERE route_id in (SELECT route_id FROM routes WHERE route_short_name = '$route')";
	// $queryResult = $conn->query($query);
	// if (!$queryResult) die ($conn->error);

	$trip_ids = $queryResult;

	// $rows = $queryResult->num_rows;
	// $trip_ids = array();
	// for ($i = 0; $i < $rows; $i++) {
	// 	$queryResult->data_seek($i);
	// 	$row = $queryResult->fetch_array(MYSQLI_ASSOC);
	// 	$tripid = $row['trip_id'];
	// 	array_push($trip_ids, $tripid);
	// }
	// print_r($trip_ids);
	// ----------------------------------------------------------------

	// $params = array("tripid" => $trip_ids);



	// -------------------- API CALL PART 1 ---------------------------
	$params = array();

	$results = apiCall($APIKey, $url, $params);
	header('Content-Type: application/json');

	$decoded = json_decode($results[0]);

	// print $decoded->status;
	// print_r($decoded->response->entity[0]->vehicle->trip->trip_id);

	$final_trip_ids = array();

	for ($i = 0; $i < count($decoded->response->entity); $i++) {
		// print_r($decoded->response->entity[$i]->vehicle->trip->trip_id);
		$tempid = $decoded->response->entity[$i]->vehicle->trip->trip_id;
		if (in_array($tempid, $trip_ids)) {
			// echo "Found it at: $i" . "\n";
			array_push($final_trip_ids, $tempid);
			// break;
		}
	}

	// print_r($final_trip_ids);
// ----------------------------------------------------------------




// -------------------- API CALL PART 2 ---------------------------
// This call is unncecessary but I'm too tired to fix it right now


	if (count($final_trip_ids) == 0) {
		// There are no trips, so... return nothing
		$result->response = null;
		$final_results = json_encode($result);
		print $final_results;

		// $j = json_decode($final_results);
		// print_r($j);
	} else {
		// There are valid trip_ids, so do another request for the
		// trips that match the route
		$final_params = array("tripid" => $final_trip_ids);
		$final_results = apiCall($APIKey, $url, $final_params);
		print $final_results[0];

		// $j = json_decode($final_results[0]);
		// print_r($j);
	}



// ----------------------------------------------------------------




//page 318
?>

