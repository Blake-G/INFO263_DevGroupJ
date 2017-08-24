<?php
$active = "home";
require_once 'include/header.php';
?>
<div id="map"></div>
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDr0a376m4pWJKroaZ5qXCLTq2-pHPoxOY&callback=initMap">
</script>
<script src="scripts/map.js"></script>
<script>
    $(document).ready(function() {

    });
</script>
<?php
require_once 'include/footer.php';
?>
