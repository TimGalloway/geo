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
<script>
$( document ).ready(function() {
    console.log( "ready!" );
    //initmap();
});
</script>
</head>
<body>
    <div class="header">
     <p>
      <div class="headerimage">
        <img src="images/watermark.png" />
      </div>
      <div class="headertitle">
       Sensitivity Atlas
      </div>
     </p>
    </div>
    <div class="header"
         <p>
    <div class="param">
    Param1: <select><option>A</option><option>B</option></select>
        </div>
    <div class="param">
    Param1: <select><option>A</option><option>B</option></select>
        </div>
    <div class="param">
    DataType: <select name="selDataType" id="selDataType">
		 <option value="S">Smartline</option>
		 <option value="B">Bio Sensitive</option>
        <option value="C">Both</option>
              </select>
        </div>
    <div class="param">
    <input type="button" value="GO!" id="btnGo" name="btnGo">
        </div>
         </p>
    </div>
    <div class="content">
        <div id="left">
        </div>
        <div class="right">
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
         </div>
     </div>
</body>
</html>
