function playPLS(url, title) {
    window.setInterval(function () {
        if (document.getElementById("player").readyState === 3 || document.getElementById("player").readyState === 4) {
            document.getElementById("atc_ready_state").style.color = "green"
        } else {
            document.getElementById("atc_ready_state").style.color = "red"
        }
        var time = document.getElementById("player").currentTime
        document.getElementById("atc_current_time").innerHTML = HHMMSS(time)
    }, 1000)
    document.getElementById("atc_spacer").style.display = "block"
    document.getElementById("atc_ready_state").style.display = "block"
    document.getElementById("atc_current_time").style.display = "block"
    document.getElementById("audioControl").style.display = "block"
    document.getElementById("atc_location").innerHTML = ""
    document.getElementById("atc_location").style.display = "block"
    document.getElementById("atc_title").innerHTML = ""
    document.getElementById("atc_title").innerHTML = title
    var airport = $("#atc_airport_code").text()
    $.getJSON('json/world_airports.json', function (world_airports) {
        var city = world_airports[airport].city
        var state = world_airports[airport].state
        document.getElementById("atc_location").innerHTML = city + ", " + state
        // MAP MARKER INFO
        var markerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                snapToPixel: false,
                fill: new ol.style.Fill({
                    color: 'blue'
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 2
                })
            })
        });

        var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([world_airports[airport].lon, world_airports[airport].lat])));
        feature.setStyle(markerStyle);
        lastATC = StaticFeatures.push(feature) - 1
        if (lastATC === 1) {
            StaticFeatures.removeAt(0)
        }
        // PLS INFO
        const proxyurl = "http://" + window.location.hostname + ":7000/";
        var request = $.ajax({
            url: 'information/liveatc.json',
            timeout: 5000,
            cache: true,
            dataType: 'json'
        });
        request.done(function (data) {
            fetch(proxyurl + 'http://www.liveatc.net' + url, {
                    mode: 'cors'
                })
                .then(response => response.text())
                .then(native => native.split('\n'))
                .then(split => split[1])
                .then(data => data.substring(6, data.length))
                .then(url => document.getElementById("player").setAttribute("src", url))
                .then(dat => document.getElementById("player").load())
                .then(dat => document.getElementById("player").play())
        })
    })

}

function playPause() {
    var text = document.getElementById("audioControl_icon").innerHTML
    if (text === "play_arrow") {
        document.getElementById("player").play()
        document.getElementById("audioControl_icon").innerHTML = "pause"
    } else if (text === "pause") {
        document.getElementById("player").pause()
        document.getElementById("audioControl_icon").innerHTML = "play_arrow"
    }
}

function listStations() {
    document.getElementById("atc_selector").innerHTML = ""
    var request = $.ajax({
        url: 'information/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function (data) {
        for (state in data) {
            var node = document.createElement("div")
            node.setAttribute("id", "atc_" + state)
            node.setAttribute("class", "atc_state noselect pointer")
            node.setAttribute("onmousedown", "selectState('" + state + "')")
            node.innerHTML = "<b>" + state + "</b>"
            document.getElementById("atc_selector").appendChild(node)
        }
        var node = document.createElement("div")
        node.innerHTML = "<br><br><br>"
        document.getElementById("atc_selector").appendChild(node)
    })
}


function selectState(state) {
    document.getElementById("atc_selector").innerHTML = ""
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_header noselect pointer")
    node.setAttribute("onmousedown", "listStations()")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_header noselect")
    node.setAttribute("onmousedown", "selectState('" + state + "')")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("hr")
    document.getElementById("atc_selector").appendChild(node)
    var request = $.ajax({
        url: 'information/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function (data) {
        data = data[state].airports
        for (airport in data) {
            if (data[airport].feeds === 'ERROR') {

            } else {
                var node = document.createElement("div")
                node.setAttribute("id", "atc_" + airport)
                node.setAttribute("class", "atc_state noselect pointer")
                node.setAttribute("onmousedown", "selectAirport('" + airport + "','" + state + "')")
                node.innerHTML = "<b>" + airport + "</b>"
                document.getElementById("atc_selector").appendChild(node)
            }
        }
        var node = document.createElement("div")
        node.innerHTML = "<br><br><br>"
        document.getElementById("atc_selector").appendChild(node)
    })
}


function selectAirport(airport, state) {
    document.getElementById("atc_selector").innerHTML = ""
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_header1 noselect pointer")
    node.setAttribute("onmousedown", "selectState('" + state + "')")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_header1 noselect")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + airport)
    node.setAttribute("class", "atc_header1 noselect")
    node.innerHTML = "<b id='atc_airport_code'>" + airport + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("hr")
    document.getElementById("atc_selector").appendChild(node)
    var request = $.ajax({
        url: 'information/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function (data) {
        data = data[state].airports[airport].feeds
        for (airport in data) {
            var node = document.createElement("div")
            node.setAttribute("id", "atc_" + airport)
            node.setAttribute("class", "atc_state noselect pointer")
            node.setAttribute("onmousedown", "playPLS('" + data[airport].url + "','" + data[airport].name + "')")
            node.innerHTML = "<b>" + data[airport].name + "</b>"
            document.getElementById("atc_selector").appendChild(node)

        }
        var node = document.createElement("div")
        node.innerHTML = "<br><br><br>"
        document.getElementById("atc_selector").appendChild(node)
    })

}

function HHMMSS(time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}