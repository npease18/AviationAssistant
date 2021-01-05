var us_airports = {}

function initializeSchedulesPage() {
    FetchPending = $.ajax({
        url: 'json/us_airports.json',
        timeout: 5000,
        cache: false,
        dataType: 'json',
    });
    FetchPending.done(function(data) {
        us_airports = data
        for (state in us_airports) {
            var node = document.createElement("option")
            node.setAttribute("value", state)
            node.innerHTML = state
            document.getElementById("itinerary_states").appendChild(node)
        }
    })
}

function itineraryLoadAirports() {
    document.getElementById("itinerary_loading").style.display = "block"
    document.getElementById("arrivals").style.display = "none"
    document.getElementById("departures").style.display = "none"
    document.getElementById("sch-arrivals").style.display = "none"
    document.getElementById("sch-departures").style.display = "none"
    document.getElementById("itinerary_undefined").style.display = "none"
    while (document.getElementById("itinerary_airports").firstChild) {
        document.getElementById("itinerary_airports").removeChild(document.getElementById("itinerary_airports").firstChild);
    }
    document.getElementById("itinerary_airports").style.display = "inline"
    var state = document.getElementById("itinerary_states").value
    for (airport in us_airports[state].airports) {
        var node = document.createElement("option")
        node.setAttribute("value", airport)
        node.innerHTML = airport
        document.getElementById("itinerary_airports").appendChild(node)
    }
}

function airportSchedule() {
    var airport = document.getElementById("itinerary_airports").value
    retrieveSchedule(airport)
}

function retrieveSchedule(airport) {
    document.getElementById("itinerary_loading").style.display = "none"
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
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