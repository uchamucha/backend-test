const express = require("express");
const app = express();

const data = require("./data.json");
const axios = require("axios");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

//route1 access from client
app.get("/", (req, res) => {
  res.send("Hello From Expresssss!!!");
});

//route 2
app.get("/API/data", (req, res) => {
  res.send(data);
});

//route 3
app.get("/API/lsg", async (req, res) => {
  let response = await axios.get(
    "https://hotspot-api.ngh.staging.n1sh.com/hotspots/latest.json"
  );
  res.send(response.data);
});

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listeninggg");
});
