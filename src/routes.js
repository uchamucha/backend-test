const express = require("express");
const controllers = require("./controllers");
const router = express.Router();
const path = require("path");
const axios = require("axios");
const cors = require("cors");
//route1 access from client
//we use path because unlike client side the root directory is the base system root and not your router folder
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//route 2 lsg data
router.get("/API/hotspots", cors(), async (req, res) => {
  let distJSON = await controllers.getDistJSON();
  res.send(distJSON);
});

//route 3
router.get("/API/lsglist", cors(), async (req, res) => {
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
router.get("/API/overview", cors(), async (req, res) => {
  let response = await axios.get(
    "https://api.covid19india.org/state_district_wise.json"
  );

  let overviewKnr = response.data.Kerala.districtData.Kannur;

  res.send(overviewKnr);
});

//route5 - graphsdata
router.get("/API/details", cors(), async (req, res) => {
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

module.exports = router;
