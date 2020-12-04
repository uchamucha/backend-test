const express = require("express");
const app = express();

const routes = require("./routes");

let port = process.env.PORT || 5000; //process.env.PORT to get whatever port available in the env variable PORT

app.use(routes);

//when server run will listen on this port.
app.listen(port, () => {
  console.log("listening");
});
