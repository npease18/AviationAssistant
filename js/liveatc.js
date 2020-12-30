function playPLS(url, title) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
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
            node.setAttribute("onclick", "selectState('" + state + "')")
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
    node.setAttribute("onclick", "listStations()")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("atc_selector").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("id", "atc_" + state)
    node.setAttribute("class", "atc_state noselect")
    node.setAttribute("onclick", "selectState('" + state + "')")
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
                node.setAttribute("onclick", "selectAirport('" + airport + "','" + state + "')")
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
    node.setAttribute("onclick", "selectState('" + state + "')")
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
            node.setAttribute("onclick", "playPLS('" + data[airport].url + "','" + data[airport].name + "')")
            node.innerHTML = "<b>" + data[airport].name + "</b>"
            document.getElementById("atc_selector").appendChild(node)

        }
        var node = document.createElement("div")
        node.innerHTML = "<br><br><br>"
        document.getElementById("atc_selector").appendChild(node)
    })
}