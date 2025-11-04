// convert_topo.js
const fs = require('fs');
const topojson = require('topojson-server');

// Load your GeoJSON
const geo = JSON.parse(fs.readFileSync('london_wgs84.geojson'));

// Convert to TopoJSON
// Use the property that identifies boroughs, e.g., GSS_CODE
const topo = topojson.topology({ boroughs: geo }, { id: d => d.properties.GSS_CODE });

// Save TopoJSON
fs.writeFileSync('london_topo.json', JSON.stringify(topo));
console.log("✅ TopoJSON saved as london_topo.json");

