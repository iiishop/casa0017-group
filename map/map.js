function ready(error, uk) {
  if (error) throw error;

  console.log("Objects inside your file:", uk.objects);
  var objectName = Object.keys(uk.objects)[0];
  console.log("Using object:", objectName);

  var features = topojson.feature(uk, uk.objects[objectName]).features;
  console.log("Number of features loaded:", features.length);

  // Fit the map to your SVG area automatically
  var projection = d3.geoMercator()
      .fitSize([width, height], topojson.feature(uk, uk.objects[objectName]));

  var path = d3.geoPath().projection(projection);

  svg.append("g")
    .selectAll("path")
    .data(features)
    .enter().append("path")
      .attr("d", path)
      .attr("fill", "#aad3df")
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5);

  console.log("Map drawn successfully");
}
