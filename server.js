const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");
const cors = require("cors");

const turf = require("@turf/turf");
const polylabel = require("polylabel");
const { feature, geometry } = require("@turf/turf");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

const getknrJSON = async () => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );
  let knrFeatures = response.data.features.filter((obj) => {
    return obj.properties.district === "Kannur";
  });

  // adding centroid to each feature
  knrFeatures.forEach((feature) => {
    feature.properties.centroid = {};
    feature.properties.centroid.long = polylabel(
      feature.geometry.coordinates,
      1.0
    )[0];
    feature.properties.centroid.lat = polylabel(
      feature.geometry.coordinates,
      1.0
    )[1];

    console.log(feature.properties.centroid);
  });

  let knrJSON = { type: "FeatureCollection", features: knrFeatures };

  return knrJSON;
};

getknrJSON();

//route1 access from client
//we use path because unlike client side the root directory is the base system root and not your app folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//route 2 lsg data
app.get("/API/hotspots", cors(), async (req, res) => {
  let knrJSON = await getknrJSON();
  res.send(knrJSON);
});

//route 3
app.get("/API/lsglist", cors(), async (req, res) => {
  let temp = await getknrJSON();

  let lsglist = temp.features.map((obj) => {
    return {
      id: obj.properties.id,
      label: obj.properties.label,
      czones: obj.properties.notes,
    };
  });

  res.send(lsglist);
});

//route4 - overview
app.get("/API/overview", cors(), async (req, res) => {
  let response = await axios.get(
    "https://api.covid19india.org/state_district_wise.json"
  );

  let overviewKnr = response.data.Kerala.districtData.Kannur;

  res.send(overviewKnr);
});

//route5 - graphsdata
app.get("/API/details", cors(), async (req, res) => {
  let response = await axios.get(
    "https://api.covid19india.org/v4/data-all.json"
  );

  let temp = [];

  temp.push(response.data);

  let temp1 = [];

  temp.forEach((obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value.KL.districts !== undefined)
        if (value.KL.districts.Kannur !== undefined) {
          temp1.push({ date: key, Kannur: value.KL.districts.Kannur });
        }
    }
  });

  res.send(temp1);
});

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listening");
});
