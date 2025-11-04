const fs = require('fs');
const topojson = require('topojson-client');

// Load TopoJSON
const topo = JSON.parse(fs.readFileSync('london_topo.json'));

// See the object names
console.log("Objects inside your file:", Object.keys(topo.objects));

// Pick the first object
const objectName = Object.keys(topo.objects)[0];

// Convert to GeoJSON
const geojson = topojson.feature(topo, topo.objects[objectName]);

console.log("Number of features:", geojson.features.length);

// Check the first feature's properties
console.log("First feature properties:", geojson.features[0].properties);

