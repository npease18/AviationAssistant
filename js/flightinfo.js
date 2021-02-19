// Generic update function for radar subtabs
function updateFlightTab() {
    $.getJSON("https://aviation-edge.com/v2/public/flights?key=" + keys['AE'] + "&aircraftIcao24=" + SelectedPlane, function(flightdata) {
        flightdata = flightdata[0]
        $.getJSON("https://aviation-edge.com/v2/public/timetable?key=" + keys['AE'] + "&flight_icao=" + flightdata.flight.icaoNumber + "&status=active", function(scheduledata) {
            scheduledata = scheduledata[0]
            $.getJSON('json/airlines.json', function(world_airlines) {
                $.getJSON('json/world_airports.json', function(world_airports) {
                    $.getJSON('json/airplanes.json', function(aircraft_information) {
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
                    })
                });
            });
        });
    });
}

// handles information of flight itself
function flightInfo(data, world_airports, world_airlines) {
    document.getElementById("flight_flightnum").innerHTML = data.flight.number
    document.getElementById("flight_status").innerHTML = toTitleCase(data.status)
    document.getElementById("flight_flighticaonum").innerHTML = data.flight.icaoNumber
    document.getElementById("flight_airport_long_origin").innerHTML = world_airports[data.departure.icaoCode].name
    document.getElementById("flight_airport_long_destination").innerHTML = world_airports[data.arrival.icaoCode].name
    document.getElementById("flight_airport_loc_origin").innerHTML = world_airports[data.departure.icaoCode].city + ", " + country_names[world_airports[data.departure.icaoCode].country]
    try {
        document.getElementById("flight_airline").innerHTML = world_airlines[data.airline.icaoCode].nameAirline + " "
    } catch {
        document.getElementById("flight_airline").innerHTML = "N/A "
    }
    document.getElementById("flight_airport_short_origin").innerHTML = data.departure.icaoCode
    document.getElementById("flight_airport_short_destination").innerHTML = data.arrival.icaoCode
    document.getElementById("flight_airport_loc_destination").innerHTML = world_airports[data.arrival.icaoCode].city + ", " + country_names[world_airports[data.arrival.icaoCode].country]
}

// get's aircraft information
function getAircraftInfo(aircraft_information, data) {
    var aircraft = aircraft_information[data.aircraft.iataCode]
    if (aircraft) {
        document.getElementById("aircraft_name").innerHTML = aircraft.productionLine
        document.getElementById("aircraft_modelcode").innerHTML = aircraft.modelCode
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

// Flight's current progress
function flightProgress(flightdata, world_airports, data) {
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
    var transit_time = arrival_time.diff(departure_time, ["days", "hours", "minutes"])
    transit_time = transit_time.toObject()
    if (transit_time.days != 0) {
        document.getElementById("flight_transit_time").innerHTML = transit_time.days + "D " + transit_time.hours + "H " + transit_time.minutes + "M"
    } else {
        document.getElementById("flight_transit_time").innerHTML = transit_time.hours + "H " + transit_time.minutes + "M"
    }
    var current_time = DateTime.local();
    var time_remaining = arrival_time.diff(current_time, ["days", "hours", "minutes", "seconds"])
    time_remaining = time_remaining.toObject()
    if (time_remaining.days != 0) {
        document.getElementById("flight_remaining_time").innerHTML = time_remaining.days + "D " + time_remaining.hours + "H " + time_remaining.minutes + "M"
    } else {
        document.getElementById("flight_remaining_time").innerHTML = time_remaining.hours + "H " + time_remaining.minutes + "M"
    }
    var trip_progress = getTripProgress(arrival_time, departure_time)
    document.getElementById("flight_percentage_spinner").innerHTML = trip_progress + "%"
    document.getElementById("flight_progress_circle").setAttribute("class", "progress-circle p" + trip_progress)
    flight_info[SelectedPlane].schedule.progress = trip_progress
    getFlightPlanImage(flightdata, trip_progress, world_airports)
}

//Flight progress percentage
function getTripProgress(arrival_time, departure_time) {
    var current_time = DateTime.local();
    var total_time = arrival_time.diff(departure_time);
    var time_elapsed = current_time.diff(departure_time);
    var trip_progress = ((time_elapsed * 100) / total_time).toFixed(0)
    document.getElementById("flight_progress").MaterialProgress.setProgress(trip_progress);
    return trip_progress
}

// Get image of aircraft
function getPlaneImage(flightdata) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var page_nodes = $($.parseHTML(xhr.response));
            var img = page_nodes.find("#results > div:nth-child(1) > div.result__section.result__section--photo-wrapper > a > img")
            document.getElementById("aircraft_image1").setAttribute('src', img.attr('src'))
            document.getElementById("aircraft_image2").setAttribute('src', img.attr('src'))
            flight_info[SelectedPlane].aircraft.imageurl = img.attr('src')
            return
        }
    }
    xhr.send(JSON.stringify({
        command: "curl https://www.jetphotos.com/photo/keyword/" + flightdata.aircraft.regNumber
    }));
}

// get image of whole flight path
function getFlightPlanImage(data, flight_progress, world_airports) {
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
    var dep_date = departure_time.toFormat('yyyyMMdd')
    document.getElementById("progress_image").setAttribute("src", "https://www.flightview.com/fvPublicSiteFT/FlightViewCGI.exe?qtype=gif&acid=" + data.flight.iataNumber + "&depap=" + data.departure.iataCode + "&arrap=" + data.arrival.iataCode + "&depdate=" + dep_date + "&pctcomplete=" + flight_progress)
    flight_info[SelectedPlane].flightimage = "https://www.flightview.com/fvPublicSiteFT/FlightViewCGI.exe?qtype=gif&acid=" + data.flight.iataNumber + "&depap=" + data.departure.iataCode + "&arrap=" + data.arrival.iataCode + "&depdate=" + dep_date + "&pctcomplete=" + flight_progress
}