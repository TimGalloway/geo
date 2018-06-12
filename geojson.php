<?php
/*
 * Title:   PostGIS to GeoJSON
 * Notes:   Query a PostGIS table or view and return the results in GeoJSON format, suitable for use in OpenLayers, Leaflet, etc.
 * Author:  Bryan R. McBride, GISP
 * Contact: bryanmcbride.com
 * GitHub:  https://github.com/bmcbride/PHP-Database-GeoJSON
 */

$dataType = $_GET['dataType'];

# Connect to PostgreSQL database
$conn = new PDO('pgsql:host=localhost;dbname=biologically_important_areas','tim','SuzTL1000');
# Build SQL SELECT statement and return the geometry as a GeoJSON element
if ($dataType == "B"){
    $sql = 'SELECT gid,species_gr,region,taxon_id,genus,species,com_name,legend,location,public.ST_AsGeoJSON(public.ST_Transform((geom),4326),6) AS geojson FROM biologically_important_areas WHERE ST_DWithin(geom, ST_MakePoint(113.53538900000001, -25.928723)::geography, 10000);  ';
}
else{
    $sql = 'SELECT smartline.intertd1_v, smartline.exposure_v,sensitivity_lookup.sensitivity, public.ST_AsGeoJSON(public.ST_Transform((geom),4326),6) AS geojson FROM smartline, sensitivity_lookup WHERE smartline.intertd1_v = sensitivity_lookup.intertd1_v AND smartline.exposure_v = sensitivity_lookup.exposure_v AND ST_DWithin(smartline.geom, ST_MakePoint(113.53538900000001, -25.928723)::geography, 100000)';
}
/*
* If bbox variable is set, only return records that are within the bounding box
* bbox should be a string in the form of 'southwest_lng,southwest_lat,northeast_lng,northeast_lat'
* Leaflet: map.getBounds().toBBoxString()
*/
if (isset($_GET['bbox'])) {
    $bbox = explode(',', $_GET['bbox']);
    $sql = $sql . ' WHERE public.ST_Transform(the_geom, 4326) && public.ST_SetSRID(public.ST_MakeBox2D(public.ST_Point('.$bbox[0].', '.$bbox[1].'), public.ST_Point('.$bbox[2].', '.$bbox[3].')),4326);';
}
# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}
# Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);
# Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
    $properties = $row;
    # Remove geojson and geometry fields from properties
    unset($properties['geojson']);
    unset($properties['the_geom']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode($row['geojson'], true),
         'properties' => $properties
    );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}
header('Content-type: application/json');
#echo '[';
echo json_encode($geojson, JSON_NUMERIC_CHECK);
#echo ']';
$conn = NULL;
?>
