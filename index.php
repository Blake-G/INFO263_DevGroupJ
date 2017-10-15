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
		    	timer = setInterval(function() {
		    		route_short_name = $('#dropdown').find(":selected").text();
		    		if(timerExists) {
                        updateMap(route_short_name, true);
                        console.log("  * Auto update * ");
                    }
		    	}, time); //5000ms = 5s just for now
		    	timerExists = true;
                $("#stopRefresh").html("Auto refresh on.");
                $("#stopRefresh").addClass("btn-success");
                $("#stopRefresh").removeClass("btn-danger");
                console.log("Started the auto refresh");
		    }
	    }
        function stopAutoRefresh(time) {
    	    // Stops the timer
            // Changes #stop refresh button properties
            timerExists = false;
            $("#stopRefresh").html("Auto refresh off.");
            $("#stopRefresh").addClass("btn-danger");
            $("#stopRefresh").removeClass("btn-success");
            console.log("Stopped the auto refresh");
            clearTimeout(time);
        }

        function refreshTimer() {
    	    // Refreshes the timer if there is a timer set
            if(timerExists) {
                console.log("--- Refresh timer ---")
                stopAutoRefresh(timer);
                startAutoRefresh(updateTime);
                console.log("--- ------------- ---")
            }
        }

    	$('#dropdown').change(function() {
    	    // Calls an Update on the map to the newly selected bus route
            // If timer on refreshes the timer
    		route_short_name = $('#dropdown').find(":selected").text();
    		updateMap(route_short_name, false); // This function is in 'map.js'
    		console.log("Dropdown update");
    		refreshTimer();

    	});

    	$('#button').click(function() {
    	    // On click Manually call an update to the map
            // If timer on refreshes the timer
    		route_short_name = $('#dropdown').find(":selected").text();
    		updateMap(route_short_name, false);
    		console.log("Click update");
            refreshTimer();
    	});


        $('#stopRefresh').click(function() {
            // On refresh button click change state from On to off and off to on.
            if(timerExists) {
                stopAutoRefresh(timer);
            } else {
                startAutoRefresh(updateTime);
            }
        });

        $('#recenter').click(function(){
            adjustMapBounds();
        });

        //Sets the timer to not refresh at the start
        stopAutoRefresh(timer);


    });
</script>
<br><button id="recenter">Center</button>
<br><button id="button">Update</button><br>
<button id="stopRefresh" class="btn-success">Start</button><br>
<div id="testdiv">

</div>
<?php
require_once 'include/footer.php';
?>
