const axios = require("axios")
const cheerio = require('cheerio');
const airport_json = require('./airports.json')
var fs = require("fs")
const io = require('@pm2/io')
var json = {}
var progress = 0

const currentAirport = io.metric({
    name: 'Current Airport'
})

const processedNumber = io.metric({
    name: 'Current Number Processed'
})

const totalNumber = io.metric({
    name: 'Total to be processed'
})

totalNumber.set(Object.keys(airport_json).length)

function requestWebsite(airport) {
    progress++
    console.log("[PRO] " + airport + " " + progress + "/" + Object.keys(airport_json).length)
    if (airport_json[airport].country === "US") {
        axios({
                method: 'get',
                url: "https://www.liveatc.net/search/?icao=" + airport,
                timeout: 0
            })
            .then((response) => {
                console.log("[GET] " + airport + " " + progress + "/" + Object.keys(airport_json).length)
                parseData(response.data, airport)
            })
            .catch((error) => {
                console.log("[ERR] " + airport + " " + progress + "/" + Object.keys(airport_json).length)
            });
    }
}

function parseData(body, airport) {
    let a = cheerio.load(body);
    if (json[airport_json[airport].state]) {

    } else {
        json[airport_json[airport].state] = {}
    }

    if (json[airport_json[airport].state].airports) {

    } else {
        json[airport_json[airport].state].airports = {}
    }


    json[airport_json[airport].state].airports[airport] = {}
        // console.log(a('div.col1:nth-child(1) > table.body > tbody > tr:nth-child(2) > td').html())
        // var feedName = a('table.body > tbody > tr > td[bgcolor="lightblue"]');
    if (a('font.body > font[color="red"]').html()) {
        json[airport_json[airport].state].airports[airport].feeds = "ERROR"
    } else {
        var feedName = a('table.body > tbody > tr > td[bgcolor="lightblue"]');
        n = 0
        json[airport_json[airport].state].airports[airport].feeds = {}
        json[airport_json[airport].state].airports[airport].name = airport_json[airport].name
        feedName.each(function() {
            let title = a(this).find("strong").text();
            json[airport_json[airport].state].airports[airport].feeds[n] = {}
            json[airport_json[airport].state].airports[airport].feeds[n].name = title
            n++
        });
        var pageurl = a('table.body > tbody > tr:nth-child(4) > td')
        i = 0
        pageurl.each(function() {
            let title = a(this).find("a").attr('href');
            if (title) {
                json[airport_json[airport].state].airports[airport].feeds[i].url = title
                i++
            }
        });
    }

}
for (airport in airport_json) {
    requestWebsite(airport_json[airport].icao)
}

setTimeout(function() {
    if (progress === Object.keys(airport_json).length) {
        fs.writeFileSync('downloaded.json', JSON.stringify(json, 0, 4))
        return;
    }
}, 5000)