var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];
var RoseateTernLayer;
var FairyTernLayer;
var LesserCrestedTernLayer;

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
		default: return { color: "blue" };
	}
}

function initmap() {
	// set up the map
	map = new L.Map('map',{
		center: [-31.9535, 115.8605],
		zoom: 5
	});

	var categories = {},
		category;

	var geoJsonData;
	$.ajax({
		'async': false,
		'url': "/geo/geojson.php",
		'success': function(data){
			geoJsonData = data;
		}
	});

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

	// Create an empty LayerGroup that will be used to emulate adding / removing all categories.
	//var allPointsLG = L.layerGroup();
	//overlaysObj["All Points"] = allPointsLG;


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
}
