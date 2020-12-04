const polylabel = require("polylabel");
//data for each district
exports.getDistJSON = async (district) => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );
  let distFeatures = response.data.features.filter((obj) => {
    return obj.properties.district === district;
  });

  console.log(distFeatures[31].geometry.coordinates);

  //adding centroid to each feature
  distFeatures.forEach((feature) => {
    feature.properties.centroid = {};

    if (feature.geometry.coordinates.length === 1) {
      feature.properties.centroid.long = polylabel(
        feature.geometry.coordinates,
        1
      )[0];

      feature.properties.centroid.lat = polylabel(
        feature.geometry.coordinates,
        1
      )[1];
    } else if (feature.geometry.coordinates.length === 2) {
      feature.properties.centroid = feature.geometry.coordinates;
    }
  });

  let distJSON = { type: "FeatureCollection", features: distFeatures };

  return distJSON;
};
