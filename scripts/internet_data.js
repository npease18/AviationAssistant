const request = require('request');
const fs = require('fs')
var json = {}



function getData() {
  const options = {
    url: 'http://localhost:7000/data-live.flightradar24.com/zones/fcgi/feed.js?faa=1&bounds=46.119%2C43.301%2C-71.629%2C-66.255&satellite=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=14400&gliders=1&stats=1',
    headers: {
      'x-requested-with': 'request'
    }
  };
  request(options, function (error, response, body) {
    if (body) {
      parseData(body)
    }
  });
  setTimeout(function () {
    getData()
  }, 10000);
  setTimeout(function () {
    changeTime()
  }, 1000);
}

function parseData(data) {
  console.log("Update")
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
        messages: 10
      })
      // console.log(element)
      //console.log(data[element][1])
      //console.log(data[element][2])
    }
  }
  fs.writeFileSync("/run/dump1090-mutability/aircraft1.json", JSON.stringify(json))
  //console.log(json)
}

function changeTime() {
  console.log("Time Change")
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
changeTime()