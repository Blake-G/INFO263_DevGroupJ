class Map {

    /**
     * Latitude and longitude of Auckland
     */
    get AUCKLAND_POSITION() {
        return {
            lat: -36.8485, lng: 174.7633
        }
    }

    /**
     * Default map parameters
     */
    get defaults() {
        return {
            center: this.AUCKLAND_POSITION, zoom: 13
        }
    }

    /**
     * If true, all map markers become visible. Otherwise they're hidden
     */
    set markersVisible(value) {
        this.markers.forEach(
            marker => marker.setMap(value ? this.map : null)
        );
    }

    /**
     * Returns a pretty-formatted HTML string with summary information
     * about a given vehicle on a given route
     */
    vehicleSummaryText({vehicle, trip, position}) {
        return `
            <div id="content">
                <div id="bodyContent">
                    <h4>Vehicle Information</h4>
                    <ul>
                        <li>Vehicle ID: ${vehicle.id}</li>
                        <li>Start Time: ${trip.start_time}</li>
                        <li>Location: (${position.latitude}, ${position.longitude})</li>
                        <li>Route ID: ${trip.route_id}</li>
                        <li>Trip ID: ${trip.trip_id}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Resets zoom and location
     */
    reset() {
        this.map.setZoom(this.defaults.zoom);
        this.map.setCenter(this.defaults.center);
    }

    /**
     * Ensures the map bounds can display all of the markers present
     */
    adjustBounds() {

        const bounds = new google.maps.LatLngBounds();

        this.markers.forEach(
            marker => bounds.extend(marker.getPosition())
        );

        this.map.fitBounds(bounds);
        this.map.getZoom() > this.MAX_ZOOM && this.map.setZoom(this.MAX_ZOOM);

    }

    /**
     * Adds a marker to the map and pushes to the array of markers
     */
    addMarker({position, title, content}) {

        const infoWindow = new google.maps.InfoWindow({content});

        const marker = new google.maps.Marker({
            position, title,
            map: this.map
        });

        marker.addListener('click', () => infoWindow.open(this.map, marker));

        this.markers.push(marker);

    }

    /**
     * Syntactic sugar for removing all markers from the map
     */
    deleteMarkers() {
        this.markersVisible = false;
        this.markers = [];
    }

    /**
     * Updates the map with information about vehicles on a specific route.
     * Calls `callback` upon successful completion.
     */
    update(route, callback) {

        // Show the loading animation

        this.loadingIndicator.toggleClass('hidden');

        // Execute the request

        $.get(this.UPDATE_ENDPOINT, {route}, response => {

            console.log(response);

            this.visibleBusesCount = response.length;

            // Regardless of the response, we need to delete the old markers

            this.deleteMarkers();

            // If there are no results, reset the map

            if (response.length == 0 || !response) {
                this.reset();
                return;
            }

            // Add markers for each vehicle

            for (let {vehicle} of response) {
                this.addMarker({
                    position: {
                        lat: vehicle.position.latitude,
                        lng: vehicle.position.longitude
                    },
                    title: `Vehicle ID: ${vehicle.vehicle.id}`,
                    content: this.vehicleSummaryText(vehicle)
                });
            }

            // Adjust the map so all markers are visible on it

            this.adjustBounds();


        }).always(() => {
            // If there is one, call the callback
            callback && callback();

            // Hide the loading animation
            this.loadingIndicator.toggleClass('hidden')
        });

    }

    /**
     * Called upon creation of a `Map` object
     */
    constructor(selector) {

        // Class constants

        this.MAX_ZOOM = 17;
        this.UPDATE_ENDPOINT = 'route_info.php';

        // Instance variables

        this.markers = [];
        this.visibleBusesCount = 0;
        this.loadingIndicator = $('#loadAnim');

        this.mapElement = $(selector)[0];
        this.map = new google.maps.Map(this.mapElement, this.defaults);

    }

}
