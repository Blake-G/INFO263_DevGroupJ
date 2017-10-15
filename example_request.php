<?php //database.php
require_once 'include/config.php';
require_once 'requests.php';

$url = "https://api.at.govt.nz/v2/public/realtime";
# if we had query parametets say, trip_ids, we would include an array of them like below
# $trip_ids = array(1, 3, 64);
# $params = array("tripid" => $trip_ids);
$params = array();
$results = apiCall(AT_API_KEY, $url, $params);
// Tell the browser we are sending back json
header('Content-Type: application/json');
print $results[0];

?>
