var fs = require("fs")
const airlines = require('./airlines.json');
var corrected_json = {}

airlines.forEach(function(json) {
    corrected_json[json.codeIcaoAirline] = json
});

fs.writeFileSync('airlines2.json', JSON.stringify(corrected_json))