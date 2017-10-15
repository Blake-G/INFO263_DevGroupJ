<?php

/**
 * all_routes.php: Returns an array of all routes from the database.
 * This is used to populate the dropdown in the app (vs just hardcoding them)
 */
require_once 'include/config.php';

function allRoutes() {

    // Connect and prepare the query

    $database = new mysqli(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    $result = $database->query('SELECT DISTINCT route_short_name FROM routes ORDER BY route_short_name');

    // Get the results from the query. They are each in the form [0 => <route name>],
    // so we'll have to map each array to just the first item in that array

    return array_map(function ($column) {
        return $column[0];
    }, $result->fetch_all());

}

?>
