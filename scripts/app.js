class App {

    get routeName() {
        return this.routeDropdown.find(':selected').text();
    }

    /**
     * Checks the number of available buses and displays an informative
     * message at the bottom of the page
     */
    updateInfoText() {

        const suffix = this.map.visibleBusesCount == 1 ? 'bus' : 'buses';

        this.infoMessages.attr('class', this.map.visibleBusesCount ? 'good' : 'bad');
        this.infoMessages.text(`There are ${this.map.visibleBusesCount} ${suffix} on this route`);

    }

    startAutoRefresh() {

        this.timer = setInterval(() => this.updateMap(), this.AUTO_REFRESH_FREQUENCY_MS);

        this.refreshButton.text('Auto refresh is on');
        this.refreshButton.removeClass('btn-danger').addClass('btn-success');

    }

    stopAutoRefresh() {

        clearTimeout(this.timer);
        this.timer = null;

        this.refreshButton.removeClass('btn-success').addClass('btn-danger');
        this.refreshButton.text('Auto refresh is off');

    }

    /**
     * Resets the timer interval to start again from this method's invocation
     */
    resetTimer() {
        this.stopAutoRefresh();
        this.startAutoRefresh();
    }

    /**
     * Updates the map and message text
     */
    updateMap() {
        this.map.update(this.routeName, () => this.updateInfoText());
    }

    /**
     * Updates routes to those stored the `window.routes` object, which is
     * populated on page load
     */
    updateRoutes() {
        for (let route of window.routes) {
            this.routeDropdown.append(
                $('<option>', {
                    value: route,
                    text: route
                })
            );
        }
    }

    constructor() {

        // Class constants

        this.AUTO_REFRESH_FREQUENCY_MS = 30000;

        // Instance variables

        this.map = new Map('#map');

        this.recentreButton = $('#recenter');
        this.updateButton = $('#button');
        this.refreshButton = $('#stopRefresh');
        this.infoMessages = $('#messages');
        this.routeDropdown = $('#dropdown');

        this.timer = null;
        this.shouldAutoUpdate = true;

        // Bind events to instance methods

        this.recentreButton.click(() => this.map.adjustBounds());
        this.updateButton.click(() => this.updateMap());

        this.routeDropdown.change(() => {
            this.updateMap();
            this.resetTimer();
        });

        this.refreshButton.click(() =>
            this.timer ? this.stopAutoRefresh() : this.startAutoRefresh()
        );

        // Peform initial processing

        this.updateRoutes();
        this.updateMap();

        this.shouldAutoUpdate && this.resetTimer();

    }

}
