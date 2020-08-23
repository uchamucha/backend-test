const express = require("express");
const app = express();
const axios = require("axios");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

//route1 access from client
app.get("/", (req, res) => {
  res.send(
    "Welcome to Covid Kannur API.\n\n Use '/API/containmentLSGs for Containment Zones JSON data'"
  );
});

//route 2
app.get("/API/containmentLSGs", async (req, res) => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );

  let knrFeatures = response.data.features.filter((obj) => {
    return obj.properties.district === "Kannur";
  });

  let filteredJSON = { type: "FeatureCollection", features: knrFeatures };

  res.send(filteredJSON);
});

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listeninggg");
});

//install cors and continue with react
