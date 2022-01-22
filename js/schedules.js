var us_airports = {}

function initializeSchedulesPage() {
    document.getElementById("itin_body").innerHTML = ""
    FetchPending = $.ajax({
        url: 'json/liveatc.json',
        timeout: 5000,
        cache: false,
        dataType: 'json',
    });
    FetchPending.done(function (data) {
        us_airports = data
        for (state in us_airports) {
            var node = document.createElement("div")
            node.setAttribute("value", state)
            node.setAttribute("class", "itin_state")
            node.setAttribute("onclick", "loadAirport('" + state + "')")
            node.innerHTML = "<b>" + state + "</b>"
            document.getElementById("itin_body").appendChild(node)
        }
    })
}

function loadAirport(state) {
    document.getElementById("itin_info").style.display = "none"
    document.getElementById("itin_body").style.display = "block"
    document.getElementById("itin_body").innerHTML = ""
    var node = document.createElement("div")
    node.setAttribute("class", "itin_header noselect pointer")
    node.setAttribute("onmousedown", "initializeSchedulesPage()")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("itin_body").appendChild(node)
    var node = document.createElement("div")
    node.setAttribute("class", "itin_header noselect")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("itin_body").appendChild(node)
    var node = document.createElement("hr")
    document.getElementById("itin_body").appendChild(node)
    for (airport in us_airports[state].airports) {
        var node = document.createElement("div")
        node.setAttribute("value", airport)
        node.setAttribute("class", "itin_state")
        node.setAttribute("onclick", "retrieveSchedule('" + airport + "','" + state + "')")
        node.innerHTML = "<b>" + airport + "</b>"
        document.getElementById("itin_body").appendChild(node)
    }
}

function retrieveSchedule(airport, state) {
    document.getElementById("itin_body").innerHTML = ""
    document.getElementById("itin_info").style.display = "block"
    document.getElementById("itin_body").style.display = "none"

    var node = document.createElement("div")
    node.setAttribute("class", "itin_header1 noselect pointer")
    node.setAttribute("onmousedown", "loadAirport('" + state + "')")
    node.innerHTML = "<b>Go Back</b>"
    document.getElementById("itin_body").appendChild(node)

    var node = document.createElement("div")
    node.setAttribute("class", "itin_header1 noselect")
    node.innerHTML = "<b>" + state + "</b>"
    document.getElementById("itin_body").appendChild(node)

    var node = document.createElement("div")
    node.setAttribute("class", "itin_header1 noselect")
    node.innerHTML = "<b>" + airport + "</b>"
    document.getElementById("itin_body").appendChild(node)

    var node = document.createElement("hr")
    document.getElementById("itin_body").appendChild(node)

    FetchPending = $.ajax({
        url: 'json/world_airports.json',
        timeout: 5000,
        cache: false,
        dataType: 'json',
    });
    FetchPending.done(function (data) {
        world_airports = data
        // MAP MARKER INFO
        var markerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                snapToPixel: false,
                fill: new ol.style.Fill({
                    color: 'red'
                }),
                stroke: new ol.style.Stroke({
                    color: 'black',
                    width: 2
                })
            })
        });
        OLMap.getView().setCenter(ol.proj.fromLonLat([world_airports[airport].lon, world_airports[airport].lat]));
        var feature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([world_airports[airport].lon, world_airports[airport].lat])));
        feature.setStyle(markerStyle);
        lastItin = StaticFeatures.push(feature) - 1
        if (lastItin === 1) {
            StaticFeatures.removeAt(0)
        }
        document.getElementById("itin_airport_city").innerHTML = world_airports[airport].city + ", " + world_airports[airport].country
        document.getElementById("itin_airport_name").innerHTML = airport
        document.getElementById("itin_back").setAttribute("onclick","loadAirport('"+state+"');")
    })


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var html = xhr.response
            var page_nodes = $($.parseHTML(html));
            document.getElementById("itinerary_loading").style.display = "none"
            if (page_nodes.find("#arrivals-board > div").html() === undefined || page_nodes.find("#arrivals-board > div > table > tbody > tr:nth-child(1) > td:nth-child(1)").html() === "&nbsp;") {
                document.getElementById("itinerary_undefined").style.display = "block"
            } else {
                document.getElementById("itinerary_undefined").style.display = "none"
                document.getElementById("arrivals").style.display = "inline-table"
                document.getElementById("departures").style.display = "inline-table"
                document.getElementById("sch-arrivals").style.display = "inline-table"
                document.getElementById("sch-departures").style.display = "inline-table"
                document.getElementById("arrivals").innerHTML = page_nodes.find("#arrivals-board > div").html()
                document.getElementById("departures").innerHTML = page_nodes.find("#departures-board > div").html()
                document.getElementById("sch-arrivals").innerHTML = page_nodes.find("#enroute-board > div").html()
                document.getElementById("sch-departures").innerHTML = page_nodes.find("#scheduled-board > div").html()
                $("#arrivals > table > thead > tr:nth-child(1) > th > h2").html("Arrivals")
                $("#departures > table > thead > tr:nth-child(1) > th > h2").html("Departures")
                $("#sch-arrivals > table > thead > tr:nth-child(1) > th > h2").html("Scheduled Arrivals")
                $("#sch-departures > table > thead > tr:nth-child(1) > th > h2").html("Scheduled Departures")
                document.querySelectorAll("#itinerary_page a").forEach(a => a.outerHTML = a.innerHTML);
            }
        }
    }
    xhr.send(JSON.stringify({
        command: "curl https://flightaware.com/live/airport/" + airport
    }));
}