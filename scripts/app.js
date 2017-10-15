class App {

    init() {

        var route_short_name; // get a value for this from the drop down list when an event occurs
    	var updateTime = 30000; // 30000 ms = 30 seconds
    	var timerExists = false; // A check to make sure we only have one auto refreshing timer
    	var timer;

    	// Timer is only started after a selection is made and won't have more than one
    	const startAutoRefresh = time => {
    		if (!timerExists) {

		    	timer = setInterval(() => {

		    		route_short_name = $('#dropdown').find(":selected").text();
                    timerExists && this.map.update(route_short_name, true, checkBuses);

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

        const checkBuses = () => {
    	    // Checks the number of available buses and displays an informative message at the bottom of the page
            if(this.map.visibleBusesCount > 0){
                var string = " buses "
                if(this.map.visibleBusesCount == 1){
                    string = " bus "
                }
                $('#messages').removeClass("bad")
                $('#messages').addClass("good")
                $('#messages').html("There are " + this.map.visibleBusesCount + string + "on this route. :^)")
            } else {
                $('#messages').removeClass("good")
                $('#messages').addClass("bad")
                $('#messages').html("There are 0 buses on this route. :^(")
            }
        }

    	$('#dropdown').change(() => {
    	    // Calls an Update on the map to the newly selected bus route
            // If timer on refreshes the timer
    		route_short_name = $('#dropdown').find(":selected").text();
    		this.map.update(route_short_name, false, checkBuses); // This function is in 'map.js'

    		console.log("Dropdown update");
    		refreshTimer();

    	});

    	$('#button').click(() => {
    	    // On click Manually call an update to the map
            // If timer on refreshes the timer
    		route_short_name = $('#dropdown').find(":selected").text();
    		this.map.update(route_short_name, false, checkBuses);

    		console.log("Click update");
            refreshTimer();
    	});


        $('#stopRefresh').click(() => {
            // On refresh button click change state from On to off and off to on.
            if(timerExists) {
                stopAutoRefresh(timer);
            } else {
                startAutoRefresh(updateTime);
            }
        });

        $('#recenter').click(() => {
            this.map.adjustBounds();
        });

        //Sets the timer to not refresh at the start
        stopAutoRefresh(timer);
        $('#button').click();

    }

    constructor() {
        this.map = new Map('#map');
        this.init();
    }

}
