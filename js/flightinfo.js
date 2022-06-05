// Generic update function for radar subtabs
function updateFlightTab() {
    if (internet_mode) {
        $.getJSON('json/airlines.json', function (world_airlines) {
            $.getJSON('json/world_airports.json', function (world_airports) {
                $.getJSON('json/airplanes.json', function (aircraft_information) {
                    // Planes[SelectedPlane] gives 
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
                                try {
                                    document.getElementById("flight_airline").innerHTML = world_airlines[data.airline].nameAirline + " "
                                } catch {
                                    document.getElementById("flight_airline").innerHTML = "N/A "
                                }
                            } else {
                                //document.getElementById("flight_flightnum").innerHTML = data.flight.replace(/\D/g, "")
                                document.getElementById("flight_flightnum").innerHTML = ""
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