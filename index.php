<html>
<head>
<link rel="stylesheet" type="text/css" href="leaflet/leaflet.css" />
<link rel="stylesheet" type="text/css" href="leaflet/leaflet-search.min.css" />
<link rel="stylesheet" type="text/css" href="js/tablesorter/themes/blue/style.css" />
<link rel="stylesheet" type="text/css" href="css/geo.css" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jput.min.js"></script>
<script type="text/javascript" src="leaflet/leaflet.js"></script>
<script type="text/javascript" src="leaflet/leaflet-search.min.js"></script>
<script type="text/javascript" src="leaflet/leaflet.ajax.min.js"></script>
<script type="text/javascript" src="js/leafletembed.js"></script>
<script type="text/javascript" src="js/tablesorter/jquery.tablesorter.min.js"></script>
<script type="text/javascript" src="js/Leaflet.Spin/leaflet.spin.min.js"></script>
<script>
$( document ).ready(function() {
    console.log( "ready!" );
    initmap();
});
</script>
</head>
<body>
<div id='divmap' class='divmap'></div>
<div id='divdatatable' class='divdatatable'>
<table id="datatable" class="tablesorter">
 <thead>
  <tr>
   <th>Species</th>
   <th>Common Name</th>
   <th>Location</th>
  </tr>
 </thead>
 <tbody>
 </tbody>
</table>
</div>
</body>
</html>
