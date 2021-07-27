const request = require('request');
const fs = require('fs')
var json = {}
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

function getData() {
  console.log('http://localhost:7000/data-live.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds='+bounds.lat_north.toFixed(3)+'%2C'+bounds.lat_south.toFixed(3)+'%2C'+bounds.long_east.toFixed(3)+'%2C'+bounds.long_west.toFixed(3)+'&satellite=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=14400&gliders=1&stats=1')
  const options = {
    url: 'http://localhost:7000/data-live.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds='+bounds.lat_north.toFixed(3)+'%2C'+bounds.lat_south.toFixed(3)+'%2C'+bounds.long_east.toFixed(3)+'%2C'+bounds.long_west.toFixed(3)+'&satellite=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=14400&gliders=1&stats=1',
    headers: {
      'x-requested-with': 'request'
    }
  };
  request(options, function (error, response, body) {
    if (body) {
      parseData(body)
    }
  });
}

function parseData(data) {
  data = JSON.parse(data)
  json.now = new Date()
  json.now = json.now.getTime() - json.now.getMilliseconds() / 1000
  json.messages = 0
  json.aircraft = []
  for (element in data) {
    if (element != "stats" && element != "full_count" && element != "version") {
      json.aircraft.push({
        hex: data[element][0].toLowerCase(),
        flight: data[element][16],
        lat: data[element][1],
        lon: data[element][2],
        altitude: data[element][4],
        track: data[element][3],
        speed: data[element][5],
        squawk: data[element][6],
        seen: 0,
        seen_pos: 0,
        rssi: 0,
        messages: 0
      })
      // console.log(element)
      //console.log(data[element][1])
      //console.log(data[element][2])
    }
  }
  for (element in json.aircraft) {
    if (json.aircraft[element].messages != 0) {
      json.aircraft[element] = {}
    } else {
      json.aircraft[element].messages =  json.aircraft[element].messages +1
    }
  }
  fs.writeFileSync("/run/dump1090-mutability/aircraft1.json", JSON.stringify(json))
  //console.log(json)
}

function changeTime() {
  fs.readFile('/run/dump1090-mutability/aircraft1.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    data = JSON.parse(data)
    for (element in data.aircraft) {
      data.aircraft[element].seen =  data.aircraft[element].seen + 1
      data.aircraft[element].seen_pos =  data.aircraft[element].seen_pos +1
    }
    fs.writeFileSync("/run/dump1090-mutability/aircraft1.json", JSON.stringify(data))
  });
}

getData()
setInterval(function () {
  getData()
}, 10000);
setInterval(function () {
  changeTime()
}, 1000);

app.post("/internet", function(req, res) {
  console.log(req.body)
  bounds = req.body
  return res.send("Recieved")
})

app.listen(8000, () =>
console.log(`Example app listening on port 8000!`),
);