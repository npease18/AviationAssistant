function playPLS(url, title) {
    const proxyurl = "https://localhost:5000/";
    var request = $.ajax({
        url: 'json/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function(data) {
        fetch(proxyurl + 'http://www.liveatc.net' + url, { mode: 'cors' })
            .then(response => response.text())
            .then(native => native.split('\n'))
            .then(split => split[1])
            .then(data => data.substring(6, data.length))
            .then(url => document.getElementById("player").setAttribute("src", url))
            .then(dat => document.getElementById("player").load())
            .then(dat => document.getElementById("atc_title").innerHTML = title)
            .then(dat => document.getElementById("player").play())
    })
}


function listStations() {
    document.getElementById("atc_selector").innerHTML = ""
    var request = $.ajax({
        url: 'json/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function(data) {
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
    node.setAttribute("class", "atc_state noselect pointer")
    node.setAttribute("onmousedown", "listStations()")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_state noselect")
    node.setAttribute("onmousedown", "selectState('" + state + "')")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("hr")
    document.getElementById("atc_selector").appendChild(node)
    var request = $.ajax({
        url: 'json/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function(data) {
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
    node.setAttribute("class", "atc_state noselect pointer")
    node.setAttribute("onmousedown", "selectState('" + state + "')")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_state noselect")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + airport)
    node.setAttribute("class", "atc_state noselect")
    node.innerHTML = "<b>" + airport + "</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("hr")
    document.getElementById("atc_selector").appendChild(node)
    var request = $.ajax({
        url: 'json/liveatc.json',
        timeout: 5000,
        cache: true,
        dataType: 'json'
    });
    request.done(function(data) {
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

//DEPRACATED
function startPulling() {
    var json = {}

    FetchPending = $.ajax({
        url: 'json/us_airports.json',
        timeout: 5000,
        cache: false,
        dataType: 'json',
    });
    FetchPending.done(function(data) {
        var us_airports = data
        for (state in us_airports) {
            for (airport in us_airports[state].airports) {
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(xhr.response)
                        let a = $(data);
                        if (json[airport_json[airport].state]) {

                        } else {
                            json[airport_json[airport].state] = {}
                        }

                        if (json[airport_json[airport].state].airports) {

                        } else {
                            json[airport_json[airport].state].airports = {}
                        }
                        if (a('font.body > font[color="red"]').html()) {
                            json[airport_json[airport].state].airports[airport].feeds = "ERROR"
                        } else {
                            var feedName = a('table.body > tbody > tr > td[bgcolor="lightblue"]');
                            n = 0
                            json[airport_json[airport].state].airports[airport].feeds = {}
                            json[airport_json[airport].state].airports[airport].name = airport_json[airport].name
                            for (b in feedName) {
                                let title = a(b).find("strong").text();
                                json[airport_json[airport].state].airports[airport].feeds[n] = {}
                                json[airport_json[airport].state].airports[airport].feeds[n].name = title
                                n++
                            }
                            var pageurl = a('table.body > tbody > tr:nth-child(4) > td')
                            i = 0
                            for (url in pageurl) {
                                let title = a(url).find("a").attr('href');
                                if (title) {
                                    json[airport_json[airport].state].airports[airport].feeds[i].url = title
                                    i++
                                }
                            }
                        }
                    }
                }
                xhr.send(JSON.stringify({
                    command: "https://www.liveatc.net/search/?icao=" + airport
                }));
            }
        }
    })
}