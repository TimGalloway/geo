<?php
/*
 * Title:   PostGIS to GeoJSON
 * Notes:   Query a PostGIS table or view and return the results in GeoJSON format, suitable for use in OpenLayers, Leaflet, etc.
 * Author:  Bryan R. McBride, GISP
 * Contact: bryanmcbride.com
 * GitHub:  https://github.com/bmcbride/PHP-Database-GeoJSON
 */
# Connect to PostgreSQL database
$conn = new PDO('pgsql:host=localhost;dbname=biologically_important_areas','tim','SuzTL1000');
# Build SQL SELECT statement and return the geometry as a GeoJSON element
$sql = 'SELECT gid,species_gr,region,taxon_id,genus,species,com_name,legend,location,breeding,foraging,migration,aggregate,other,occurrence,use_level,level_desc,eco_reason,season,comments,extra_com,expert_nam,source_cat,source_des,contact,reviewed,review_dat,review_com,program,spat_date,threatened,migratory_,marine_epb,cetacean_e,sci_advice,shape_area,shape_len, public.ST_AsGeoJSON(public.ST_Transform((geom),4326),6) AS geojson FROM biologically_important_areas WHERE ST_DWithin(geom, ST_MakePoint(113.53538900000001, -25.928723)::geography, 10000);  ';
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
