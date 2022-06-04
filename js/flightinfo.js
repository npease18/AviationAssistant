// Generic update function for radar subtabs
function updateFlightTab() {
    if (internet_mode) {
        $.getJSON('json/airlines.json', function (world_airlines) {
            $.getJSON('json/world_airports.json', function (world_airports) {
                $.getJSON('json/airplanes.json', function (aircraft_information) {
                    // Planes[SelectedPlane] gives 
                    document.getElementById("flight_progress_div").style.display = "none"
                    document.getElementById('additional_info_hidden').style.display = "none"
                    document.getElementById("img_button").disabled = true

                    document.getElementById("flight_airport_long_destination").innerHTML = ""
                    document.getElementById("flight_airport_short_destination").innerHTML = ""
                    document.getElementById("flight_airport_loc_destination").innerHTML = ""
                    document.getElementById("flight_airport_long_origin").innerHTML = ""
                    document.getElementById("flight_airport_short_origin").innerHTML = ""
                    document.getElementById("flight_airport_loc_origin").innerHTML = ""

                    for (element in internet_mode_data) {
                        if (internet_mode_data[element].hex === SelectedPlane) {
                            var data = internet_mode_data[element]
                            if (data.airline != "") {
                                document.getElementById("flight_flightnum").innerHTML = data.flight.replace(/\D/g, "")
                                document.getElementById("flight_status").innerHTML = ""
                                document.getElementById("flight_flighticaonum").innerHTML = data.flight
                                try {
                                    document.getElementById("flight_airline").innerHTML = world_airlines[data.airline].nameAirline + " "
                                } catch {
                                    document.getElementById("flight_airline").innerHTML = "N/A "
                                }
                            } else {
                                //document.getElementById("flight_flightnum").innerHTML = data.flight.replace(/\D/g, "")
                                document.getElementById("flight_status").innerHTML = ""
                                document.getElementById("flight_flightnum").innerHTML = ""
                                document.getElementById("flight_flighticaonum").innerHTML = data.flight
                                document.getElementById("flight_airline").innerHTML = data.flight
                            }
                            for (airport_search in world_airports) {
                                if (world_airports[airport_search].iata === internet_mode_data[element].arr && internet_mode_data[element].arr != "") {
                                    var airport = world_airports[airport_search]
                                    try {
                                        document.getElementById("flight_airport_long_destination").innerHTML = airport.name
                                        document.getElementById("flight_airport_short_destination").innerHTML = airport.icao
                                        document.getElementById("flight_airport_loc_destination").innerHTML = airport.city + ", " + country_names[airport.country]
                                    } catch {
                                        document.getElementById("flight_airport_long_destination").innerHTML = ""
                                        document.getElementById("flight_airport_short_destination").innerHTML = ""
                                        document.getElementById("flight_airport_loc_destination").innerHTML = ""
                                    }
                                } else if (internet_mode_data[element].arr === "") {
                                    document.getElementById("flight_airport_long_destination").innerHTML = ""
                                    document.getElementById("flight_airport_short_destination").innerHTML = ""
                                    document.getElementById("flight_airport_loc_destination").innerHTML = ""
                                }

                                if (world_airports[airport_search].iata === internet_mode_data[element].dep && internet_mode_data[element].dep != "") {
                                    var airport = world_airports[airport_search]
                                    try {
                                        document.getElementById("flight_airport_long_origin").innerHTML = airport.name
                                        document.getElementById("flight_airport_short_origin").innerHTML = airport.icao
                                        document.getElementById("flight_airport_loc_origin").innerHTML = airport.city + ", " + country_names[airport.country]
                                    } catch {
                                        document.getElementById("flight_airport_long_origin").innerHTML = ""
                                        document.getElementById("flight_airport_short_origin").innerHTML = ""
                                        document.getElementById("flight_airport_loc_origin").innerHTML = ""
                                    }
                                } else if (internet_mode_data[element].dep === "") {
                                    document.getElementById("flight_airport_long_origin").innerHTML = ""
                                    document.getElementById("flight_airport_short_origin").innerHTML = ""
                                    document.getElementById("flight_airport_loc_origin").innerHTML = ""
                                }
                            }
                        }
                    }
            
                })
            });
        });
    }
}


// handles information of flight itself
function flightInfo(data, world_airports, world_airlines) {
    try {
        document.getElementById("flight_flightnum").innerHTML = data.flight.number
        document.getElementById("flight_status").innerHTML = toTitleCase(data.status)
        document.getElementById("flight_flighticaonum").innerHTML = data.flight.icaoNumber
        try {
            document.getElementById("flight_airport_long_origin").innerHTML = world_airports[data.departure.icaoCode].name
            document.getElementById("flight_airport_short_origin").innerHTML = data.departure.icaoCode
            document.getElementById("flight_airport_loc_origin").innerHTML = world_airports[data.departure.icaoCode].city + ", " + country_names[world_airports[data.departure.icaoCode].country]
        } catch {
            document.getElementById("flight_airport_long_origin").innerHTML = ""
            document.getElementById("flight_airport_short_origin").innerHTML = ""
            document.getElementById("flight_airport_loc_origin").innerHTML = ""
        }

        try {
            document.getElementById("flight_airport_long_destination").innerHTML = world_airports[data.arrival.icaoCode].name
            document.getElementById("flight_airport_short_destination").innerHTML = data.arrival.icaoCode
            document.getElementById("flight_airport_loc_destination").innerHTML = world_airports[data.arrival.icaoCode].city + ", " + country_names[world_airports[data.arrival.icaoCode].country]
        } catch {
            document.getElementById("flight_airport_long_destination").innerHTML = ""
            document.getElementById("flight_airport_short_destination").innerHTML = ""
            document.getElementById("flight_airport_loc_destination").innerHTML = ""
        }


        try {
            document.getElementById("flight_airline").innerHTML = world_airlines[data.airline.icaoCode].nameAirline + " "
        } catch {
            document.getElementById("flight_airline").innerHTML = "N/A "
        }
    } catch {
    }
}

// get's aircraft information
function getAircraftInfo(aircraft_information, data) {
    var aircraft = aircraft_information[data.aircraft.iataCode]
    if (aircraft) {
        document.getElementById("aircraft_name").innerHTML = aircraft.productionLine
        document.getElementById("aircraft_name_addl").innerHTML = aircraft.productionLine
        document.getElementById("aircraft_model").innerHTML = aircraft.modelCode
        document.getElementById("aircraft_registration").innerHTML = aircraft.numberRegistration
        document.getElementById("aircraft_engine").innerHTML = aircraft.enginesType
        document.getElementById("aircraft_engine_count").innerHTML = aircraft.enginesCount
        document.getElementById("aircraft_status").innerHTML = toTitleCase(aircraft.planeStatus)
        document.getElementById("aircraft_age").innerHTML = aircraft.planeAge
        if (aircraft.rolloutDate) {
            document.getElementById("aircraft_rollout_date").innerHTML = DateTime.fromISO(aircraft.rolloutDate).toLocaleString("DATE_SHORT")
        }
        if (aircraft.firstFlight) {
            document.getElementById("aircraft_first_flight").innerHTML = DateTime.fromISO(aircraft.firstFlight).toLocaleString("DATE_SHORT")
        }

    }
}

// Get image of aircraft
function getPlaneImage(flightdata) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var page_nodes = $($.parseHTML(xhr.response));
            var img1 = page_nodes.find("#results > div:nth-child(1) > div.result__section.result__section--photo-wrapper > a > img")
            var img2 = page_nodes.find("#results > div:nth-child(3) > div.result__section.result__section--photo-wrapper > a > img")
            var img3 = page_nodes.find("#results > div:nth-child(4) > div.result__section.result__section--photo-wrapper > a > img")
            var img4 = page_nodes.find("#results > div:nth-child(5) > div.result__section.result__section--photo-wrapper > a > img")
            if (img2) {
                document.getElementById("aircraft_image2").setAttribute('src', img2.attr('src'))
                flight_info[SelectedPlane].aircraft.imageurl2 = img2.attr('src')
                document.getElementById("aircraft_image3").style.display = "block"
            } else {
                document.getElementById("aircraft_image2").style.display = "none"
            }

            if (img3) {
                document.getElementById("aircraft_image3").setAttribute('src', img3.attr('src'))
                flight_info[SelectedPlane].aircraft.imageurl3 = img3.attr('src')
                document.getElementById("aircraft_image3").style.display = "block"
            } else {
                document.getElementById("aircraft_image3").style.display = "none"
            }

            if (img4) {
                document.getElementById("aircraft_image4").style.display = "block"
                document.getElementById("aircraft_image4").setAttribute('src', img4.attr('src'))
                flight_info[SelectedPlane].aircraft.imageurl4 = img4.attr('src')
            } else {
                document.getElementById("aircraft_image4").style.display = "none"
            }



            document.getElementById("aircraft_image1").setAttribute('src', img1.attr('src'))
            document.getElementById("aircraft_image1-1").setAttribute('src', img1.attr('src'))
            flight_info[SelectedPlane].aircraft.imageurl1 = img1.attr('src')
            return
        }
    }
    xhr.send(JSON.stringify({
        command: "curl https://127.0.0.1:7000/www.jetphotos.com/photo/keyword/" + flightdata.aircraft.regNumber
    }));
}

function setBigImage(source) {
    var source_url = document.getElementById(source).getAttribute("src")
    var dest_url = document.getElementById("aircraft_image1-1").getAttribute("src")
    document.getElementById("aircraft_image1-1").setAttribute("src", source_url)
    document.getElementById(source).setAttribute("src", dest_url)
}