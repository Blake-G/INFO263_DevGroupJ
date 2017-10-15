<?php
    require_once 'include/header.php';
?>

<div id="map"></div>

<div id="controls">
    <h3>Bus Route:</h3>

    <button id="refresh" class="button">Start</button>
    <button id="update" class="button btn-info">Update</button>
    <button id="centre-map" class="button btn-info">Centre Map</button>

    <select id="routes-dropdown">
        <?php
            require_once 'all_routes.php';
            foreach (allRoutes() as $routeName) {
                echo "<option value='$routeName'>$routeName</option>";
            }
        ?>
    </select>
</div>

<div id="msg">
    <h4>Messages:</h4>
    <p id="messages"></p>
</div>

<script async defer src="https://maps.googleapis.com/maps/api/js?key=<?= GOOGLE_MAPS_KEY ?>&callback=hasLoaded.maps.resolve"></script>
<script src="scripts/main.js"></script>
<script src="scripts/app.js"></script>
<script src="scripts/map.js"></script>

<?php
    require_once 'include/footer.php';
?>
