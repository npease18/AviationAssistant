var us_airports = {}

function initializeSchedulesPage() {
    document.getElementById("itin_body").innerHTML = ""
    document.getElementById("itin_img").setAttribute("src", 'images/black.jpg')
    FetchPending = $.ajax({
        url: 'information/liveatc.json',
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
    document.getElementById("itin_img").setAttribute("src", 'images/black.jpg')
    document.getElementById("itin_info").style.display = "none"
    document.getElementById("itin_body").style.display = "block"
    document.getElementById("itin_body").innerHTML = ""
    document.getElementById("sidebar_close").style.color = "rgba(0, 0, 0, 0.7)";
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
    var regexp = /\d/;
    for (airport in us_airports[state].airports) {
        if (!regexp.test(airport.charAt(0)) || !exclude) {
            var node = document.createElement("div")
            node.setAttribute("value", airport)
            node.setAttribute("class", "itin_state")
            node.setAttribute("onclick", "retrieveSchedule('" + airport + "','" + state + "')")
            node.innerHTML = "<b>" + airport + "</b>"
            document.getElementById("itin_body").appendChild(node)
        }
    }
}

function retrieveSchedule(airport, state) {
    document.getElementById("itin_arr").style.display = "none"
    document.getElementById("itin_dep").style.display = "none"
    document.getElementById("itin_body").innerHTML = ""
    document.getElementById("itin_info").style.display = "block"
    document.getElementById("itin_body").style.display = "none"
    document.getElementById("sidebar_close").style.color = "rgba(255, 255, 255, 0.7)";

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
        document.getElementById("itin_airport_city").innerHTML = world_airports[airport].city + ", " + world_airports[airport].state
        document.getElementById("itin_airport_name").innerHTML = airport
        document.getElementById("itin_airport_long_name").innerHTML = world_airports[airport].name
        document.getElementById("itin_airport_loc").innerHTML = parseFloat(world_airports[airport].lat).toFixed(2) + ", " + parseFloat(world_airports[airport].lon).toFixed(2)
        document.getElementById("itin_back").setAttribute("onclick", "loadAirport('" + state + "');")

        var xhr1 = new XMLHttpRequest();
        xhr1.open("GET", "http://"+window.location.hostname+":7000/www.airnav.com/airport/" + airport.slice(1,4), true);
        //xhr1.setRequestHeader('origin', '*');
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState === 4) {
                var html = xhr1.response
                var page_nodes = $($.parseHTML(html));
                page_nodes.find("img").each(function (index) {
                    if ($(this).attr('alt')) {
                        if ($(this).attr('alt').includes("Aerial")) {
                            document.getElementById("itin_img").setAttribute("src", $(this).attr('src'))
                        }
                    }
                })
    
                /*  console.log(page_nodes.find("table:nth-child(8) > tbody > tr.part_body > td > font > img").attr("src"))
                  if (page_nodes.find("table:nth-child(8) > tbody > tr.part_body > td > font > img").attr("src")) {
                      document.getElementById("itin_img").setAttribute("src",page_nodes.find("table:nth-child(8) > tbody > tr.part_body > td > font > img").attr("src"))
                  }*/
            }
        }
        xhr1.send();
    })

   

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://"+window.location.hostname+":5000/curl", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var html = xhr.response
            var page_nodes = $($.parseHTML(html));
            if (page_nodes.find("#arrivals-board > div").html() === undefined || page_nodes.find("#arrivals-board > div > table > tbody > tr:nth-child(1) > td:nth-child(1)").html() === "&nbsp;") {

            } else {
                document.getElementById("itin_arr").innerHTML = page_nodes.find("#enroute-board > div").html() + page_nodes.find("#arrivals-board > div").html()
                document.getElementById("itin_dep").innerHTML = page_nodes.find("#scheduled-board > div").html() + page_nodes.find("#departures-board > div").html()
                var arrow = document.createElement("span")
                arrow.setAttribute("class","material-icons")
                arrow.setAttribute("id","itin_back_chart")
                arrow.setAttribute("onclick", "retrieveSchedule('"+airport+"','"+state+"')")
                arrow.innerHTML = "arrow_back_ios"
                var title = document.createElement("span")
                title.innerHTML = airport + " ARRIVALS"
                title.setAttribute("class","itinheader")
                title.prepend(arrow)
                document.querySelector("#itin_arr").prepend(title)
                document.querySelectorAll("#itin_arr a").forEach(a => a.outerHTML = a.innerHTML);
                document.querySelectorAll("#itin_dep a").forEach(a => a.outerHTML = a.innerHTML);
                document.querySelector("#itin_arr > table:nth-child(2)").style.backgroundColor = "black"
                document.querySelector("#itin_arr > table:nth-child(2) > thead > tr:nth-child(1)").remove()
                document.querySelector("#itin_arr > table:nth-child(3)").style.backgroundColor = "black"
                document.querySelector("#itin_arr > table:nth-child(3) > thead > tr:nth-child(1)").remove()

                var arrow1 = document.createElement("span")
                arrow1.setAttribute("class","material-icons")
                arrow1.setAttribute("id","itin_back_chart")
                arrow1.setAttribute("onclick", "retrieveSchedule('"+airport+"','"+state+"')")
                arrow1.innerHTML = "arrow_back_ios"
                var title1 = document.createElement("span")
                title1.innerHTML = airport + " DEPARTURES"
                title1.setAttribute("class","itinheader")
                title1.prepend(arrow1)
                document.querySelector("#itin_dep").prepend(title1)
                document.querySelectorAll("#itin_dep a").forEach(a => a.outerHTML = a.innerHTML);
                document.querySelectorAll("#itin_dep a").forEach(a => a.outerHTML = a.innerHTML);
                document.querySelector("#itin_dep > table:nth-child(2)").style.backgroundColor = "black"
                document.querySelector("#itin_dep > table:nth-child(2) > thead > tr:nth-child(1)").remove()
                document.querySelector("#itin_dep > table:nth-child(3)").style.backgroundColor = "black"
                document.querySelector("#itin_dep > table:nth-child(3) > thead > tr:nth-child(1)").remove()

                // Getting the table
                var tble = document.querySelector("#itin_arr > table")

                // Getting the rows in table.
                var row = tble.rows;

                // Removing the column at index(1).  
                var i = 1;
                for (var j = 0; j < row.length; j++) {
                    // Deleting the ith cell of each row.
                    row[j].deleteCell(1);
                    row[j].deleteCell(3);
                    row[j].deleteCell(2);
                }

                // Getting the table
                var tble = document.querySelector("#itin_arr > table:nth-child(3)")

                // Getting the rows in table.
                var row = tble.rows;

                // Removing the column at index(1).  
                var i = 1;
                for (var j = 0; j < row.length; j++) {
                    // Deleting the ith cell of each row.
                    row[j].deleteCell(1);
                    row[j].deleteCell(3);
                    row[j].deleteCell(2);
                }

                 // Getting the table
                 var tble = document.querySelector("#itin_dep > table")

                 // Getting the rows in table.
                 var row = tble.rows;
 
                 // Removing the column at index(1).  
                 var i = 1;
                 for (var j = 0; j < row.length; j++) {
                     // Deleting the ith cell of each row.
                     row[j].deleteCell(1);
                     row[j].deleteCell(4);
                     row[j].deleteCell(3);
                 }
 
                 // Getting the table
                 var tble = document.querySelector("#itin_dep > table:nth-child(3)")
 
                 // Getting the rows in table.
                 var row = tble.rows;
 
                 // Removing the column at index(1).  
                 var i = 1;
                 for (var j = 0; j < row.length; j++) {
                     // Deleting the ith cell of each row.
                     row[j].deleteCell(1);
                     row[j].deleteCell(4);
                     row[j].deleteCell(3);
                 }
                

            }
        }
    }
    xhr.send(JSON.stringify({
        url: "https://flightaware.com/live/airport/" + airport
    }));

}