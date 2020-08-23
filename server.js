const express = require("express");
const app = express();
const path = require("path");
const axios = require("axios");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

const getknrJSON = async () => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );
  let knrFeatures = response.data.features.filter((obj) => {
    return obj.properties.district === "Kannur";
  });
  let knrJSON = { type: "FeatureCollection", features: knrFeatures };
  return knrJSON;
};

//route1 access from client
//we use path because unlike client side the root directory is the base system root and not your app folder
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//route 2 lsg data
app.get("/API/hotspots", async (req, res) => {
  let knrJSON = await getknrJSON();
  res.send(knrJSON);
});

//route 3
app.get("/API/lsglist", async (req, res) => {
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

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listeninggg");
});

//install cors and continue with react
