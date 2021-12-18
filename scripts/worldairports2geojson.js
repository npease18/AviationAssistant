var fs = require("fs")
const world_airports = require("../json/world_airports.json");
var geojson_features = []
var geojson = {
    "type": "FeatureCollection",
    "features": geojson_features
  }


for (airport in world_airports) {
    var tempjson = {}
    tempjson.type = "Feature"
    tempjson.geometry = {}
    tempjson.geometry.type = "Point"
    tempjson.geometry.coordinates = [world_airports[airport].lon, world_airports[airport].lat]
    tempjson.properties = {}
    tempjson.properties.name = world_airports[airport].name + " (" + airport + ")"
    geojson_features.push(tempjson)
}
console.log(geojson)
fs.writeFileSync('wa_geojson.json', JSON.stringify(geojson))