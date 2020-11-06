function openMetar() {
    document.getElementById("metar_container").style.display = "block"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "none"
    TAB = "METAR"
    var center = ol.proj.toLonLat(OLMap.getView().getCenter(), OLMap.getView().getProjection());
    nearestStations(center[1], center[0])
}

function openRadar() {
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "block"
    document.getElementById("atc_container").style.display = "none"
    TAB = "RADAR"
}

function openATC() {
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "block"
    TAB = "ATC"
    listStations()
}

function readBatteryLevel() {
    FetchPending = $.ajax({
        url: 'data/battery.json',
        timeout: 5000,
        cache: false,
        dataType: 'json'
    });
    FetchPending.done(function(data) {
        document.getElementById("percentage").innerHTML = data.percentage[0].level + "%"
        battery = data.adapter[0].status
        if (battery === "in") {
            document.getElementById('battery').innerHTML = "battery_charging_full"
            console.log("charging")
        } else if (data.percentage[0].level < 21) {
            document.getElementById('battery').innerHTML = "battery_alert"
            console.log("low")
        } else {
            document.getElementById('battery').innerHTML = "battery_full"
            console.log("full")
        }
    });

}

function celciusToF(number) {
    return number * 9 / 5 + 32
}

function metersToF(number) {
    return number * 3.28084
}

function numToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function ktsToMPH(num) {
    return num * 1.15078
}

function showInformation() {
    document.getElementById("settings_information").style.display = "block"

}

function volUp() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        direction: 1
    }));
    console.log(xhr.response)
    document.getElementById("volume_level").innerHTML = xhr.response
}

function volDown() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        direction: 0
    }));
    console.log(xhr.response)
    document.getElementById("volume_level").innerHTML = xhr.response
}

function getInitialVolume() {

}
