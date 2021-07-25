const request = require('request');
const fs = require('fs')
var json = {}

setTimeout(getData, 10000);

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
}

function parseData(data) {
    data = JSON.parse(data)
    json.now = new Date()
    json.now = json.now.getTime()-json.now.getMilliseconds()/1000
    json.messages = 0
    json.aircraft = []
    for (element in data) {
        if (element != "stats" && element != "full_count" && element != "version") {
           json.aircraft.push({
               hex: data[element][0],
               flight: data[element][16],
               lat: data[element][1],
               lon: data[element][2],
               altitude: data[element][4],
               track: data[element][3],
               speed: data[element][5],
               squawk: data[element][6],
               "seen_pos": 0,
               "seen": 0
           })
            // console.log(element)
            //console.log(data[element][1])
            //console.log(data[element][2])
        }
    }
    fs.writeFileSync("/run/dump1090-mutability/aircraft1.json", JSON.stringify(json))
    console.log(json)
}

getData()