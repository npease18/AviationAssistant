function updateFlightTab() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://aviation-edge.com/v2/public/flights?key=" + keys['AE'] + "&aircraftIcao24=" + SelectedPlane, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.response)
            var data = data[0]
            $.getJSON('json/airlines.json', function(world_airlines) {
                $.getJSON('json/world_airports.json', function(world_airports) {
                    document.getElementById("flight_flightnum").innerHTML = data.flight.number
                    document.getElementById("flight_status").innerHTML = toTitleCase(data.status)
                    document.getElementById("flight_flighticaonum").innerHTML = data.flight.icaoNumber
                    document.getElementById("flight_airport_long_origin").innerHTML = world_airports[data.departure.icaoCode].name
                    document.getElementById("flight_airport_long_destination").innerHTML = world_airports[data.arrival.icaoCode].name
                    document.getElementById("flight_airline").innerHTML = world_airlines[data.airline.icaoCode].nameAirline + " "
                    document.getElementById("flight_airport_short_origin").innerHTML = data.departure.icaoCode
                    document.getElementById("flight_airport_short_destination").innerHTML = data.arrival.icaoCode
                    getFlightProgress(data)
                    flight_info[SelectedPlane] = data
                });
            });
        }
    }
    xhr.send();
}

function getFlightProgress(flightdata) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://aviation-edge.com/v2/public/timetable?key=" + keys['AE'] + "&flight_icao=" + flightdata.flight.icaoNumber + "&status=active", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.response)
            var data = data[0]
            if (JSON.parse(xhr.response).success === false) {
                document.getElementById("radar_flight_info").style.display = "block"
                document.getElementById("radar_flight_loading").style.display = "none"
                document.getElementById("flight_transit_time").innerHTML = "N/A"
                document.getElementById("flight_depart_time").innerHTML = ""
                document.getElementById("flight_arrival_time").innerHTML = ""
                document.getElementById("flight_remaining_time").innerHTML = "N/A"
            } else {
                var departure_time = DateTime.fromISO(data.departure.actualTime)
                document.getElementById("flight_depart_time").innerHTML = departure_time.toLocaleString(DateTime.DATETIME_MED)
                var arrival_time = DateTime.fromISO(data.arrival.estimatedTime)
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
                document.getElementById("radar_flight_info").style.display = "block"
                document.getElementById("radar_flight_loading").style.display = "none"
                flight_info[SelectedPlane].schedule = data
                getTripProgress(arrival_time, departure_time)
            }
        }
    }
    xhr.send();
}

function getTripProgress(arrival_time, departure_time) {
    var current_time = DateTime.local();
    var total_time = arrival_time.diff(departure_time);
    var time_elapsed = current_time.diff(departure_time);
    var trip_progress = ((time_elapsed * 100) / total_time).toFixed(0)
    document.getElementById("flight_progress").MaterialProgress.setProgress(trip_progress);
}