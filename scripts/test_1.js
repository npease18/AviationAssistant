var bounds = {
  lat_north: 0,
  lat_south: 0,
  long_east: 0,
  long_west: 0
}
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/internet", function(req, res) {
    console.log(req.body)
    return res.send("Hello There!")
})

app.listen(8000, () =>
  console.log(`Example app listening on port 8000!`),
);