$(document).ready(function()
    {
        $("#myTable").tablesorter();
    
        //Setup click for button
        $("#btnGo").click(function(){
          initmap($("#selDataType").val());
        });
    }
);

var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var RoseateTernLayer;
var FairyTernLayer;
var LesserCrestedTernLayer;

//dataTypes
// S = smartline
// B = biologically important areas
// C = Combined smartline and biologically important areas
//var dataType = 'C';

function roseateTernStyle()
{
	return {color: "green"};
}

function fairyTernStyle()
{
	return {color: "purple"};
}

function lesserCrestedTernStyle()
{
	return {color: "blue"};
}

function getLayerStyle(com_name){
	switch(com_name){
		case 'Fairy Tern' : return { color: "green" };
		case 'Lesser Crested Tern' : return { color: "yellow" };
		case 'Roseate Tern' : return { color: "blue" };
		case 'Wedge-tailed Shearwater' : return { color: "red" };
		case 'Humpback Whale' : return { color: "purple" };
		case 'High Sensitivity (ESI Category 8A-8E)' : return { color: "purple" };
		case 'Unclassified' : return { color: "blue" };
		default: return { color: "blue" };
	}
}

function initmap(dataType) {
	// set up the map
    if (map != undefined){
      map.remove();
    }
	map = new L.Map('divmap',{
		center: [-31.9535, 115.8605],
		zoom: 5
	});

	var categories = {},
		category;

	var geoJsonData;
	$.ajax({
		'async': false,
		'url': "/geo/geojson.php?dataType="+dataType,
		'success': function(data){
			geoJsonData = data;
		}
	});

    switch(dataType){
        case 'B':        
	       var allPoints = L.geoJson(geoJsonData,{
		      style: function(feature){
			     return getLayerStyle(feature.properties.com_name)
		      },
		      onEachFeature: function(feature, layer){
			     layer.bindPopup(feature.properties.species_gr + '<br>' + feature.properties.com_name + '<br>' + feature.properties.location);
			     category = feature.properties.com_name;
			     if (typeof categories[category] === "undefined"){
				        categories[category] = [];
			     }
			     categories[category].push(layer);
		      }
	       });
               break;
        case 'S':
        case 'C':
	       var allPoints = L.geoJson(geoJsonData,{
		      style: function(feature){
			     return getLayerStyle(feature.properties.sensitivity)
		      },
		      onEachFeature: function(feature, layer){
			     layer.bindPopup(feature.properties.sensitivity + '<br>' + feature.properties.intertd1_v + '<br>' + feature.properties.exposure_v);
			     category = feature.properties.sensitivity;
			     if (typeof categories[category] === "undefined"){
				        categories[category] = [];
			     }
			     categories[category].push(layer);
		      }
	       });
               break;
    }

    
    
	var overlaysObj = {},
	    categoryName,
	    categoryArray,
	    categoryLG;

	for (categoryName in categories) {
	    categoryArray = categories[categoryName];
	    categoryLG = L.layerGroup(categoryArray);
	    categoryLG.categoryName = categoryName;
	    overlaysObj[categoryName] = categoryLG;
	}

	// create the tile layer with correct attribution
	var streetsUrl='https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	var streets = L.tileLayer(
		streetsUrl,
		{
			id: 'mapbox.streets',
			attribution: 'AVHPL | Map data © OpenStreetMap contributors, CC-BY-SA, Imagery © CloudMade'
		}
	).addTo(map);

	var baseMaps = {
		"Streets": streets
	};
	var control = L.control.layers(baseMaps, overlaysObj, { collapsed: false }).addTo(map);

	map.on({
		overlayadd: function(e) {
			var name = e.name;
			name = name.replace(/\s+/g, '-').toLowerCase();
			var findRows = "#datatable tr." + name;
			$(findRows).removeClass("hidden");
		},
		overlayremove: function(e) {
			var name = e.name;
			name = name.replace(/\s+/g, '-').toLowerCase();
			var findRows = "#datatable tr." + name;
			$(findRows).addClass("hidden");
		}
	});

	var $table = $('#datatable');
	$.each(geoJsonData.features, function (i, val) {
        switch(dataType){
            case 'B':        
		      var str = val.properties.com_name;
		      var $r = "<tr class='hidden " + str.replace(/\s+/g, '-').toLowerCase() + "'>";
    		  $r = $r + '<td>' + val.properties.species_gr + '</td>';
    		  $r = $r + '<td>' + val.properties.com_name + '</td>';
    		  $r = $r + '<td>' + val.properties.location + '</td>';
		      $r = $r + "</tr>";
            case 'S':
		      var str = val.properties.sensitivity;
		      var $r = "<tr class='hidden " + str.replace(/\s+/g, '-').toLowerCase() + "'>";
    		  $r = $r + '<td>' + val.properties.intertd1_v + '</td>';
    		  $r = $r + '<td>' + val.properties.exposure_v + '</td>';
    		  $r = $r + '<td>' + val.properties.sensitivity + '</td>';
		      $r = $r + "</tr>";
        }
    		$table.append($r);
	});
}
