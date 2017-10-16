class App {

    get routeName() {
        return this.routeDropdown.find(':selected').text();
    }

    /**
     * Checks the number of available buses and displays an informative
     * message at the bottom of the page
     */
    updateInfoText() {

        const prefix = this.map.visibleBusesCount == 1 ? 'is' : 'are';
        const suffix = this.map.visibleBusesCount == 1 ? 'bus' : 'buses';

        this.infoMessages.attr('class', this.map.visibleBusesCount ? 'good' : 'bad');
        this.infoMessages.text(`There ${prefix} ${this.map.visibleBusesCount} ${suffix} on this route`);

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

    constructor() {

        // Class constants

        this.AUTO_REFRESH_FREQUENCY_MS = 30000;

        // Instance variables

        this.map = new Map('#map');

        this.recentreButton = $('#centre-map');
        this.updateButton = $('#update');
        this.refreshButton = $('#refresh');
        this.infoMessages = $('#messages');
        this.routeDropdown = $('#routes-dropdown');

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

        this.updateMap();
        this.shouldAutoUpdate && this.resetTimer();

    }

}
