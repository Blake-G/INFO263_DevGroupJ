<?php
$active = "home";
require_once 'include/header.php';
?>
<select id="dropdown">
</select>
<div id="map"></div>
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6A5-qVznwBsQg3xMZu2hpAhTsVd7f2GI&callback=initMap">
</script>
<script src="scripts/map.js"></script>
<script src="scripts/add_routes_to_dropdown.js"></script>

<script>
    $(document).ready(function() {

    	var route_short_name; // get a value for this from the drop down list when an event occurs
    	var updateTime = 30000; // 30000 ms = 30 seconds
    	var timerExists = false; // A check to make sure we only have one auto refreshing timer
    	var timer;

    	// Timer is only started after a selection is made and won't have more than one
    	function startAutoRefresh(time) {
    		if (!timerExists) {
    			console.log("Created timer");
		    	timer = setInterval(function() {
		    		route_short_name = $('#dropdown').find(":selected").text();
		    		updateMap(route_short_name, true);
		    		console.log("Auto update");
		    	}, time); //5000ms = 5s just for now
		    	timerExists = true;
		    }
	    }

	    function stopAutoRefresh(myTimer) { // Doesn't stop the auto refresh at the moment... don't know why
	    	clearInterval(myTimer);
	    	//timerExists = false;
	    }

    	$('#dropdown').change(function() {
    		route_short_name = $('#dropdown').find(":selected").text();
    		updateMap(route_short_name, false); // This function is in 'map.js'
    		console.log("Dropdown update");

    		stopAutoRefresh(timer);
    		startAutoRefresh(updateTime);

    	});

    	$('#button').click(function() {
    		route_short_name = $('#dropdown').find(":selected").text();
    		updateMap(route_short_name, false);
    		console.log("Click update");

    		stopAutoRefresh(timer);
    		startAutoRefresh(updateTime);
    	});

        $('#stopRefresh').click(function() {
            clearInterval(timer);
            timerExists = false;
            console.log("Stopped the auto refresh");
        });

    });
</script>

<br><button id="button">Click Me</button><br>
<button id="stopRefresh">Stop Auto Refresh</button><br>
<div id="testdiv">

</div>
<?php
require_once 'include/footer.php';
?>
