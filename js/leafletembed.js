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

function initmap() {
	// set up the map
	map = new L.Map('map',{
		center: [-31.9535, 115.8605],
		zoom: 5
	});

	// create the tile layer with correct attribution
	//var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var streetsUrl='https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	var streets = L.tileLayer(
		streetsUrl,
		{
			id: 'mapbox.streets',
			attribution: 'Map data © OpenStreetMap contributors, CC-BY-SA, Imagery © CloudMade'
		}
	).addTo(map);
	//var osmAttrib='AVHPL | Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	//var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 12, attribution: osmAttrib});		

	// start the map in Western Australia
	//map.setView(new L.LatLng(-31.9535, 115.8605),3);
	//map.addLayer(osm);

	$.getJSON("/geo/geojson.php", function(data){
		RoseateTernLayer = L.geoJson(data, {
			style: roseateTernStyle,
			onEachFeature: function(feature, featureLayer){
				featureLayer.bindPopup(feature.properties.species_gr + '<br>' + feature.properties.com_name + '<br>' + feature.properties.location);
			},
			filter: function(feature, layer){
				return (feature.properties.com_name === "Roseate Tern");
			}
		}).addTo(map);
		FairyTernLayer = L.geoJson(data, {
			style: fairyTernStyle,
			onEachFeature: function(feature, featureLayer){
				featureLayer.bindPopup(feature.properties.species_gr + '<br>' + feature.properties.com_name + '<br>' + feature.properties.location);
			},
			filter: function(feature, layer){
				return (feature.properties.com_name === "Fairy Tern");
			}
		}).addTo(map);
		LesserCrestedTernLayer = L.geoJson(data, {
			style: lesserCrestedTernStyle,
			onEachFeature: function(feature, featureLayer){
				featureLayer.bindPopup(feature.properties.species_gr + '<br>' + feature.properties.com_name + '<br>' + feature.properties.location);
			},
			filter: function(feature, layer){
				return (feature.properties.com_name === "Lesser Crested Tern");
			}
		}).addTo(map);
	});
	var baseMaps = {
		"Streets": streets
	};
	var stuffLayers = {
		"Roseate Tern": RoseateTernLayer,
		"Fairy Tern": FairyTernLayer,
		"Lesser Crested Tern": LesserCrestedTernLayer
	};
	//L.control.layers(baseMaps, stuffLayers).addTo(map);
	L.control.layers(baseMaps).addTo(map);
}
