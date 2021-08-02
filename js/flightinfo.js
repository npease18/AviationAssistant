// Generic update function for radar subtabs
function updateFlightTab() {
    if (flight_info[SelectedPlane]) {
        $.getJSON('json/airlines.json', function (world_airlines) {
            $.getJSON('json/world_airports.json', function (world_airports) {
                $.getJSON('json/airplanes.json', function (aircraft_information) {
                    var flightdata = flight_info[SelectedPlane]
                    var scheduledata = flight_info[SelectedPlane].schedule
                    flightInfo(flightdata, world_airports, world_airlines)
                    flightProgress(flightdata, world_airports, scheduledata)
                    getAircraftInfo(aircraft_information, flightdata)
                    getPlaneImage(flightdata)
                    document.getElementById("radar_flight_info").style.display = "block"
                    document.getElementById("radar_flight_loading").style.display = "none"
                    document.getElementById("radar_aircraft_info").style.display = "block"
                    document.getElementById("radar_aircraft_loading").style.display = "none"
                })
            });
        });

    } else {
        if (internet_mode) {
            $.getJSON('json/airlines.json', function (world_airlines) {
                $.getJSON('json/world_airports.json', function (world_airports) {
                    $.getJSON('json/airplanes.json', function (aircraft_information) {
                        // Planes[SelectedPlane] gives 
                        document.getElementById("flight_progress_div").style.display = "none"
                        document.getElementById('additional_info_hidden').style.display = "none"
                        document.getElementById("img_button").disabled = true
                        document.getElementById("radar_aircraft_tab_button").disabled = true
                        for (element in internet_mode_data) {
                            if (internet_mode_data[element].hex === SelectedPlane) {
                                var data = internet_mode_data[element]
                                console.log(internet_mode_data[element])
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
                                    document.getElementById("flight_flightnum").innerHTML = data.flight.replace(/\D/g, "")
                                    document.getElementById("flight_status").innerHTML = ""
                                    document.getElementById("flight_flighticaonum").innerHTML = data.flight
                                    document.getElementById("flight_airline").innerHTML = ""
                                }
                                for (airport_search in world_airports) {
                                    if (world_airports[airport_search].iata === internet_mode_data[element].arr && internet_mode_data[element].arr != "") {                                       
                                        var airport = world_airports[airport_search]
                                        try {
                                            document.getElementById("flight_airport_long_destination").innerHTML = airport.name
                                            document.getElementById("flight_airport_short_destination").innerHTML = airport.icao
                                            document.getElementById("flight_airport_loc_destination").innerHTML = airport.city + ", " + country_names[airport.country]
                                        } catch {
                                            document.getElementById("flight_airport_long_destination").innerHTML = "N/A"
                                            document.getElementById("flight_airport_short_destination").innerHTML = "N/A"
                                            document.getElementById("flight_airport_loc_destination").innerHTML = "N/A"
                                        }
                                    } else if (internet_mode_data[element].arr === "") {
                                        document.getElementById("flight_airport_long_destination").innerHTML = "N/A"
                                        document.getElementById("flight_airport_short_destination").innerHTML = "N/A"
                                        document.getElementById("flight_airport_loc_destination").innerHTML = "N/A"
                                    }

                                    if (world_airports[airport_search].iata === internet_mode_data[element].dep && internet_mode_data[element].dep != "") {
                                        var airport = world_airports[airport_search]
                                        try {
                                            document.getElementById("flight_airport_long_origin").innerHTML = airport.name
                                            document.getElementById("flight_airport_short_origin").innerHTML = airport.icao
                                            document.getElementById("flight_airport_loc_origin").innerHTML = airport.city + ", " + country_names[airport.country]
                                        } catch {
                                            document.getElementById("flight_airport_long_origin").innerHTML = "N/A"
                                            document.getElementById("flight_airport_short_origin").innerHTML = "N/A"
                                            document.getElementById("flight_airport_loc_origin").innerHTML = "N/A"
                                        }
                                    } else if (internet_mode_data[element].dep === "") {
                                        document.getElementById("flight_airport_long_origin").innerHTML = "N/A"
                                        document.getElementById("flight_airport_short_origin").innerHTML = "N/A"
                                        document.getElementById("flight_airport_loc_origin").innerHTML = "N/A"
                                    }
                                }
                            }
                        }
                        document.getElementById("radar_flight_info").style.display = "block"
                        document.getElementById("radar_flight_loading").style.display = "none"
                        document.getElementById("radar_aircraft_info").style.display = "block"
                        document.getElementById("radar_aircraft_loading").style.display = "none"
                    })
                });
            });
        } else {
            $.getJSON("https://aviation-edge.com/v2/public/flights?key=" + keys['AE'] + "&aircraftIcao24=" + SelectedPlane, function (flightdata) {
                flightdata = flightdata[0]
                $.getJSON("https://aviation-edge.com/v2/public/timetable?key=" + keys['AE'] + "&flight_icao=" + flightdata.flight.icaoNumber + "&status=active", function (scheduledata) {
                    scheduledata = scheduledata[0]
                    $.getJSON('json/airlines.json', function (world_airlines) {
                        $.getJSON('json/world_airports.json', function (world_airports) {
                            $.getJSON('json/airplanes.json', function (aircraft_information) {
                                flight_info[SelectedPlane] = flightdata
                                flight_info[SelectedPlane].schedule = scheduledata
                                flight_info[SelectedPlane].aircraft.information = aircraft_information[flightdata.aircraft.iataCode]
                                flightInfo(flightdata, world_airports, world_airlines)
                                flightProgress(flightdata, world_airports, scheduledata)
                                getAircraftInfo(aircraft_information, flightdata)
                                getPlaneImage(flightdata)

                                document.getElementById("radar_flight_info").style.display = "block"
                                document.getElementById("radar_flight_loading").style.display = "none"
                                document.getElementById("radar_aircraft_info").style.display = "block"
                                document.getElementById("radar_aircraft_loading").style.display = "none"
                                document.getElementById("img_button").disabled = false
                            })
                        });
                    });
                });
            });
        }

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
            document.getElementById("flight_airport_long_origin").innerHTML = "N/A"
            document.getElementById("flight_airport_short_origin").innerHTML = "N/A"
            document.getElementById("flight_airport_loc_origin").innerHTML = "N/A"
        }

        try {
            document.getElementById("flight_airport_long_destination").innerHTML = world_airports[data.arrival.icaoCode].name
            document.getElementById("flight_airport_short_destination").innerHTML = data.arrival.icaoCode
            document.getElementById("flight_airport_loc_destination").innerHTML = world_airports[data.arrival.icaoCode].city + ", " + country_names[world_airports[data.arrival.icaoCode].country]
        } catch {
            document.getElementById("flight_airport_long_destination").innerHTML = "N/A"
            document.getElementById("flight_airport_short_destination").innerHTML = "N/A"
            document.getElementById("flight_airport_loc_destination").innerHTML = "N/A"
        }


        try {
            document.getElementById("flight_airline").innerHTML = world_airlines[data.airline.icaoCode].nameAirline + " "
        } catch {
            document.getElementById("flight_airline").innerHTML = "N/A "
        }
    } catch {
        radarRadarTabSwitch()
        document.getElementById("radar_flight_tab_button").disabled = true
        document.getElementById("radar_aircraft_tab_button").disabled = true
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

    } else {
        radarRadarTabSwitch()
        document.getElementById("radar_aircraft_tab_button").disabled = true

    }
}

// Flight's current progress
function flightProgress(flightdata, world_airports, data) {
    try {
        arrival_timezone = world_airports[data.arrival.icaoCode].tz
        departure_timezone = world_airports[data.departure.icaoCode].tz

        if (data.departure.actualTime) {
            departure_time = DateTime.fromISO(data.departure.actualTime, {
                zone: departure_timezone
            });
        } else if (data.departure.estimatedTime) {
            departure_time = DateTime.fromISO(data.departure.estimatedTime, {
                zone: departure_timezone
            });
        } else if (data.departure.scheduledTime) {
            departure_time = DateTime.fromISO(data.departure.scheduledTime, {
                zone: departure_timezone
            });
        }

        if (data.arrival.actualTime) {
            arrival_time = DateTime.fromISO(data.arrival.actualTime, {
                zone: arrival_timezone
            });
        } else if (data.arrival.estimatedTime) {
            arrival_time = DateTime.fromISO(data.arrival.estimatedTime, {
                zone: arrival_timezone
            });
        } else if (data.arrival.scheduledTime) {
            arrival_time = DateTime.fromISO(data.arrival.scheduledTime, {
                zone: arrival_timezone
            });
        }

        arrival_time = arrival_time.setZone("America/New_York")
        departure_time = departure_time.setZone("America/New_York")
        document.getElementById("flight_depart_time").innerHTML = departure_time.toLocaleString(DateTime.DATETIME_MED)
        document.getElementById("flight_arrival_time").innerHTML = arrival_time.toLocaleString(DateTime.DATETIME_MED)
        var trip_progress = getTripProgress(arrival_time, departure_time)
        document.getElementById("flight_percentage_spinner").innerHTML = trip_progress + "%"
        document.getElementById("flight_progress_circle").setAttribute("class", "progress-circle p" + trip_progress)
        flight_info[SelectedPlane].schedule.progress = trip_progress
        getFlightPlanImage(flightdata, trip_progress, world_airports)
        document.getElementById("flight_progress_div").style.display = "block"
        document.getElementById('additional_info_hidden').style.display = "block"
        if (data.departure.terminal) {
            document.getElementById("flight_depart_terminal").innerHTML = data.departure.terminal
        }
        if (data.departure.gate) {
            document.getElementById("flight_depart_gate").innerHTML = data.departure.gate
        }

        if (data.arrival.terminal) {
            document.getElementById("flight_arrival_terminal").innerHTML = data.arrival.terminal
        }
        if (data.arrival.gate) {
            document.getElementById("flight_arrival_gate").innerHTML = data.arrival.gate
        }
    } catch {
        document.getElementById("flight_progress_div").style.display = "none"
        document.getElementById('additional_info_hidden').style.display = "none"
        getFlightPlanImage(flightdata, 1, world_airports)

    }
}

//Flight progress percentage
function getTripProgress(arrival_time, departure_time) {
    var current_time = DateTime.local();
    var total_time = arrival_time.diff(departure_time);
    var time_elapsed = current_time.diff(departure_time);
    var trip_progress = ((time_elapsed * 100) / total_time).toFixed(0)
    var time_remaining = arrival_time.diff(current_time);
    document.getElementById("flight_progress").MaterialProgress.setProgress(trip_progress);
    if (time_remaining.days != 0) {
        document.getElementById("flight_progress_remaining_amount").innerHTML = time_remaining.toFormat("o 'Day(s), ' h 'Hour(s), ' m 'Minute(s)'")
    } else {
        document.getElementById("flight_progress_remaining_amount").innerHTML = time_remaining.toFormat("h 'Hour(s), ' m 'Minute(s)'")
    }
    if (time_elapsed.days != 0) {
        document.getElementById("flight_progress_elapsed_amount").innerHTML = time_elapsed.toFormat("o 'Day(s), ' h 'Hour(s), ' m 'Minute(s)'")
    } else {
        document.getElementById("flight_progress_elapsed_amount").innerHTML = time_elapsed.toFormat("h 'Hour(s), ' m 'Minute(s)'")
    }
    if (total_time.days != 0) {
        document.getElementById("flight_progress_time_amount").innerHTML = total_time.toFormat("o 'Day(s), ' h 'Hour(s), ' m 'Minute(s)'")
    } else {
        document.getElementById("flight_progress_time_amount").innerHTML = total_time.toFormat("h 'Hour(s), ' m 'Minute(s)'")
    }

    return trip_progress
}

// Get image of aircraft
function getPlaneImage(flightdata) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
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
        command: "curl https://www.jetphotos.com/photo/keyword/" + flightdata.aircraft.regNumber
    }));
}

// get image of whole flight path
function getFlightPlanImage(data, flight_progress, world_airports) {
    try {
        departure_timezone = world_airports[data.departure.icaoCode].tz
        /*
    if (data.departure.actualTime) {
        departure_time = DateTime.fromISO(data.departure.actualTime, {
            zone: departure_timezone
        });
    } else if (data.departure.estimatedTime) {
        departure_time = DateTime.fromISO(data.departure.estimatedTime, {
            zone: departure_timezone
        });
    } else if (data.departure.scheduledTime) {
        departure_time = DateTime.fromISO(data.departure.scheduledTime, {
            zone: departure_timezone
        });
    }
*/
        departure_time = DateTime.local();
        var dep_date = departure_time.toFormat('yyyyMMdd')
        document.getElementById("progress_image").setAttribute("src", "https://www.flightview.com/fvPublicSiteFT/FlightViewCGI.exe?qtype=gif&acid=" + data.flight.iataNumber + "&depap=" + data.departure.iataCode + "&arrap=" + data.arrival.iataCode + "&depdate=" + dep_date + "&pctcomplete=" + flight_progress)
        flight_info[SelectedPlane].flightimage = "https://www.flightview.com/fvPublicSiteFT/FlightViewCGI.exe?qtype=gif&acid=" + data.flight.iataNumber + "&depap=" + data.departure.iataCode + "&arrap=" + data.arrival.iataCode + "&depdate=" + dep_date + "&pctcomplete=" + flight_progress
        document.getElementById("img_button").disabled = false
    } catch {
        document.getElementById("image_modal").style.display = "none"
        document.getElementById("img_button").disabled = true
    }
}

function setBigImage(source) {
    var source_url = document.getElementById(source).getAttribute("src")
    var dest_url = document.getElementById("aircraft_image1-1").getAttribute("src")
    document.getElementById("aircraft_image1-1").setAttribute("src", source_url)
    document.getElementById(source).setAttribute("src", dest_url)
}