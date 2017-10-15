/**
 * main.js: Waits for all initalisation to finish and then creates an instance
 * of the App class (app.js).
 */

window.hasLoaded = {
    maps: $.Deferred(), dom: $.Deferred()
};

// When the DOM is ready, we'll resolve the promise

$(document).ready(hasLoaded.dom.resolve);

// Once the DOM is ready and Google Maps has initialised, we're good to go

$.when(hasLoaded.maps, hasLoaded.dom).done(() => new App());
