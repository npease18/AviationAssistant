var fs = require("fs")
const airlines = require('./json/airplanes.json');
var corrected_json = {}

airlines.forEach(function(json) {
    corrected_json[json.codeIataPlaneLong] = json
});

fs.writeFileSync('airplanes2.json', JSON.stringify(corrected_json))