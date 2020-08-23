const express = require("express");
const app = express();
const axios = require("axios");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

const getknrJSON = (response) => {
  let knrFeatures = response.data.features.filter((obj) => {
    return obj.properties.district === "Kannur";
  });
  let filteredJSON = { type: "FeatureCollection", features: knrFeatures };
  return filteredJSON;
};

//route1 access from client
app.get("/", (req, res) => {
  res.send(
    "Welcome to Covid Kannur API. \n\n Use '/API/hotspots' route for Containment Zones GeoJSON data. \n\n Use '/API/lsglist' for list of containment zones and containment wards within each zone."
  );
});

//route 2 lsg data
app.get("/API/hotspots", async (req, res) => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );
  let knrJSON = getknrJSON(response);
  res.send(knrJSON);
});

//route 3
app.get("/API/lsglist", async (req, res) => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );

  let temp = getknrJSON(response).features.map((obj) => {
    return {
      id: obj.properties.id,
      label: obj.properties.label,
      czones: obj.properties.notes,
    };
  });

  res.send(temp);
});

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listeninggg");
});

//install cors and continue with react
