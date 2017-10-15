<?php
$active = "home";
require_once 'include/header.php';
?>

<div id="map"></div>

<div id="controls">
    <h3 for="dropdown">Bus Route: </h3>
    <button id="stopRefresh" class="button">Start</button>
    <button id="button" class="button btn-info">Update</button>
    <button id="recenter" class="button btn-info">Center</button>
    <select id="dropdown"></select>
</div>

<div id="msg">
    <h4>Messages: </h4>
    <p id="messages"></p>
</div>


<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6A5-qVznwBsQg3xMZu2hpAhTsVd7f2GI&callback=hasLoaded.maps.resolve">
</script>

<script src="scripts/main.js"></script>
<script src="scripts/app.js"></script>
<script src="scripts/map.js"></script>
<script src="scripts/add_routes_to_dropdown.js"></script>

<?php
require_once 'include/footer.php';
?>
