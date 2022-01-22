function openMetar() {
    expandSidebar()
    document.getElementById("metar_container").style.display = "block"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "none"
    TAB = "METAR"
    var center = ol.proj.toLonLat(OLMap.getView().getCenter(), OLMap.getView().getProjection());
    nearestStations(center[1], center[0])
    document.getElementById("sidebar_close").style.color = "rgba(0,0,0,.7)"
    if (lastATC === 1) {
        StaticFeatures.removeAt(0)
    }
}

function openRadar() {
    expandSidebar()
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "block"
    document.getElementById("atc_container").style.display = "none"
    TAB = "RADAR"
    document.getElementById("sidebar_close").style.color = "rgba(0,0,0,.7)"
    if (lastMETAR === 1) {
        StaticFeatures.removeAt(0)
    }
    if (lastATC === 1) {
        StaticFeatures.removeAt(0)
    }
}

function openATC() {
    expandSidebar()
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "block"
    TAB = "ATC"
    listStations()
    document.getElementById("sidebar_close").style.color = "rgba(0,0,0,.7)"
    if (lastMETAR === 1) {
        StaticFeatures.removeAt(0)
    }
}

function readBatteryLevel() {
    FetchPending = $.ajax({
        url: 'data/battery.json',
        timeout: 5000,
        cache: false,
        dataType: 'json'
    });
    FetchPending.done(function (data) {
        document.getElementById("percentage").innerHTML = data.percentage[0].level + "%"
        battery = data.adapter[0].status
        if (battery === "in") {
            document.getElementById('battery').innerHTML = "battery_charging_full"

        } else if (data.percentage[0].level < 21) {
            document.getElementById('battery').innerHTML = "battery_alert"

        } else {
            document.getElementById('battery').innerHTML = "battery_full"

        }
    });

}

function celciusToF(number) {
    return number * 9 / 5 + 32
}

function metersToF(number) {
    return number * 3.28084
}

function numToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}

function ktsToMPH(num) {
    return num * 1.15078
}

function showInformation() {
    document.getElementById("settings_information").style.display = "block"
    document.getElementById("settings_default").style.display = "none"

}

function showDefault() {
    document.getElementById("settings_default").style.display = "block"
    document.getElementById("settings_information").style.display = "none"
}

function volUp() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.response)
            document.getElementById("volume_level").innerHTML = xhr.response
        }
    }
    xhr.send(JSON.stringify({
        direction: 1
    }));

}

function volDown() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.response)
            document.getElementById("volume_level").innerHTML = xhr.response
        }
    }
    xhr.send(JSON.stringify({
        direction: 0
    }));
}

function changeMapBounds(btm_left, top_right) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":8000/internet", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.response)
        }
    }
    var json = {
        lat_north: top_right[1],
        lat_south: btm_left[1],
        long_east: btm_left[0],
        long_west: top_right[0]
    }
    xhr.send(JSON.stringify(json));
}

function toggleInternet() {
    if (internet_mode === 0) {
        getBounds()
        internet_mode = 1
        document.getElementById("internet_mode").innerHTML = "wifi"
    } else if (internet_mode === 1) {
        location.reload();
    }
}

function getBounds() {
    const extent = OLMap.getView().calculateExtent(OLMap.getSize())
    var coord1 = [extent[0], extent[1]]
    var point1 = ol.proj.toLonLat(coord1, OLMap.getView().getProjection())
    var coord2 = [extent[2], extent[3]]
    var point2 = ol.proj.toLonLat(coord2, OLMap.getView().getProjection())
    changeMapBounds(point1, point2)
    //console.log(point1, point2)
}

function modal() {
    var modal = document.getElementById("info_modal");
    var btn = document.getElementById("info_button");
    var span = document.getElementById("close_modal");
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    modal2()
}

function modal2() {
    var modal = document.getElementById("image_modal");
    var btn = document.getElementById("img_button");
    var span = document.getElementById("close_modal2");
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    modal3()
}

function modal3() {
    var modal = document.getElementById("aircraft_modal");
    var btn = document.getElementById("aircraft_button");
    var span = document.getElementById("close_modal3");
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    modal4()
}

function modal4() {
    var modal = document.getElementById("power_modal");
    var btn = document.getElementById("power_button");
    var span = document.getElementById("close_modal4");
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function getInitialVolume() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.response)
            document.getElementById("volume_level").innerHTML = xhr.response
        }
    }
    xhr.send(JSON.stringify({
        direction: 2
    }));
}

function getCPUTemp() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            temp = xhr.response
            temp = temp.substring(5, temp.length - 5)
            var temp_percentage = temp / 85 * 100
            temp = celciusToF(parseFloat(temp));
            document.getElementById("internal_temperature").innerHTML = temp
            document.getElementById("internal_temperature").style.color = hsl_col_perc(temp_percentage, 0, 120)
        }
    }
    xhr.send(JSON.stringify({
        command: "vcgencmd measure_temp"
    }));
}

function readBrightnessLevel() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/brightness", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            brightness = parseFloat(xhr.response)
            document.getElementById("brightness_level").innerHTML = brightness
        }
    }
    xhr.send(JSON.stringify({
        level: 256
    }));
}



function setBrightness(direction) {
    if (direction === "up") {
        if (brightness + 5 <= 255) {
            brightness = brightness + 5
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://" + window.location.hostname + ":5000/brightness", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                level: brightness
            }));
            document.getElementById("brightness_level").innerHTML = brightness
        }
    }
    if (direction === "down") {
        if (brightness - 5 >= 15) {
            brightness = brightness - 5
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://" + window.location.hostname + ":5000/brightness", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                level: brightness
            }));
            document.getElementById("brightness_level").innerHTML = brightness
        }

    }
}

function offlineToggle() {
    if (document.getElementById("switch-1").checked) {
        openRadar()
        document.getElementById("metar_button").disabled = true;
        document.getElementById("liveatc_button").disabled = true;
        document.getElementById("player").pause()
        document.getElementById("itinerary_button").style.opacity = .4
        document.getElementById("itinerary_button").classList.remove("pointer")
        document.getElementById("itinerary_button").removeAttribute("onclick")
    } else {
        document.getElementById("metar_button").disabled = false;
        document.getElementById("liveatc_button").disabled = false;
        document.getElementById("itinerary_button").style.opacity = 1
        document.getElementById("itinerary_button").classList.add("pointer")
        document.getElementById("itinerary_button").setAttribute("onclick", "goItinerary()")
    }

}

function lockPlane() {
    selectPlaneByHex(SelectedPlane, true);
    document.getElementById("lock_button").disabled = true
}

function sendCMD(cmd) {
    if (cmd === "update") {
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.response + "A")
                if (xhr.response.substring(0, 19) === "Already up to date.") {
                    var snackbarContainer = document.getElementById('no-updates-snackbar');
                    var data = {
                        message: 'Already Up To Date!'
                    };
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                } else {
                    var snackbarContainer = document.getElementById('no-updates-snackbar');
                    var data = {
                        message: 'Updating...'
                    };
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                }
            }
        }
        xhr.send(JSON.stringify({
            command: "sudo git pull"
        }));
    }
    if (cmd === "getbranch") {
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                output = xhr.response
                var current_branch = output.substr(2, output.length - 3)
                if (current_branch === 'unstable') {
                    document.getElementById("branch_name").innerHTML = "stable"
                    document.getElementById("branch_button").setAttribute("onclick", "changeBranch('master')")
                } else {
                    document.getElementById("branch_name").innerHTML = "unstable"
                    document.getElementById("branch_button").setAttribute("onclick", "changeBranch('unstable')")
                }

            }
        }
        xhr.send(JSON.stringify({
            command: "sudo git branch | grep -F '*'"
        }));

    }
    if (cmd === "shutdown") {
        var snackbarContainer = document.getElementById('no-updates-snackbar');
        var data = {
            message: 'Shutting Down...'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.response)
                output = xhr.response
            }
        }
        xhr.send(JSON.stringify({
            command: "cd /usr/local/bin && sudo x728softsd.sh"
        }));
    }
    if (cmd === "restart") {
        var snackbarContainer = document.getElementById('no-updates-snackbar');
        var data = {
            message: 'Restarting...'
        };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.response)
                output = xhr.response
            }
        }
        xhr.send(JSON.stringify({
            command: "cd /usr/local/bin && sudo reboot"
        }));
    }


}

function tabBackgroundImage() {
    if (Planes[SelectedPlane].registration !== null) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var page_nodes = $($.parseHTML(xhr.response));
                var img1 = page_nodes.find("#results > div:nth-child(1) > div.result__section.result__section--photo-wrapper > a > img")
                if (img1.attr('src') !== undefined) {
                    document.getElementById("aircraft_tab_background").setAttribute('src', img1.attr('src'))
                    document.getElementById("sidebar_close").style.color = "rgba(0,0,0,.7)"
                } else {
                    document.getElementById("aircraft_tab_background").setAttribute('src', "images/black.jpg")
                    document.getElementById("sidebar_close").style.color = "rgba(255,255,255,.7)"
                }
                return
            }
        }
        xhr.send(JSON.stringify({
            command: "curl https://www.jetphotos.com/photo/keyword/" + Planes[SelectedPlane].registration
        }));
    } else {
        document.getElementById("aircraft_tab_background").setAttribute('src', "images/black.jpg")
        document.getElementById("sidebar_close").style.color = "rgba(255,255,255,.7)"
    }
}

function expandSidebar() {
    document.getElementById("sidebar_container").style.display = "block"
    document.getElementById("sidebar_open_button").style.display = "none"
}

function closeSidebar() {
    document.getElementById("sidebar_container").style.display = "none"
    document.getElementById("sidebar_open_button").style.display = "block"
}

function changeColorMode() {
    const themeStylesheet = document.getElementById('theme')
    //const themeToggle = document.getElementById('theme-toggle')
    if (themeStylesheet.href.includes('light')) {

        document.getElementById("logo").setAttribute("src", "images/dark/logo.png")
        document.getElementById("radar_image").setAttribute("src", "images/dark/radar.png")
        document.getElementById("itinerary_image").setAttribute("src", "images/dark/itinerary.png")
        document.getElementById("graphs_image").setAttribute("src", "images/dark/graphs.png")
        document.getElementById("settings_image").setAttribute("src", "images/dark/settings.png")
        document.getElementById("settings_logo").setAttribute("src", "images/dark/logo.png")
        themeStylesheet.href = 'css/ui1-dark.css'
        // themeToggle.innerText = 'Switch to light mode'
    } else {
        // if it's dark -> go light
        themeStylesheet.href = 'css/ui1-light.css'
        document.getElementById("logo").setAttribute("src", "images/light/logo.png")
        document.getElementById("radar_image").setAttribute("src", "images/light/radar.png")
        document.getElementById("itinerary_image").setAttribute("src", "images/light/itinerary.png")
        document.getElementById("graphs_image").setAttribute("src", "images/light/graphs.png")
        document.getElementById("settings_image").setAttribute("src", "images/light/settings.png")
        document.getElementById("settings_logo").setAttribute("src", "images/light/logo.png")
        //themeToggle.innerText = 'Switch to dark mode'
    }
}

function changeBranch(branch) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://" + window.location.hostname + ":5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        command: "sudo git checkout " + branch
    }));
    sendCMD("getbranch")
}

function goHome() {
   // document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "block"
    document.getElementById("settings_page").style.display = "none"
    document.getElementById("graphs_page").style.display = "none"
}

function goRadar() {
    //document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("radar_page").style.display = "block"
    document.getElementById("itin_nav_bar").style.display = "none"
    document.getElementById("nav_bar").style.display = "block"
    document.getElementById("radar_container").style.display = "block"
    document.getElementById("itinerary_container").style.display = "none"

    document.getElementById("home_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"
    document.getElementById("graphs_page").style.display = "none"
}

function goItinerary() {
    document.getElementById("radar_page").style.display = "block"
    document.getElementById("itin_nav_bar").style.display = "block"
    document.getElementById("nav_bar").style.display = "none"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("itinerary_container").style.display = "block"

    document.getElementById("home_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"
    document.getElementById("graphs_page").style.display = "none"
}

function goSettings() {
   // document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("settings_page").style.display = "block"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "none"
    document.getElementById("graphs_page").style.display = "none"
}


function goGraphs() {
    //document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "none"
    document.getElementById("graphs_page").style.display = "block"
}

function radarRadarTabSwitch() {
    document.getElementById("radar_radar_tab").style.display = "block"
    document.getElementById("radar_flight_tab").style.display = "none"
    document.getElementById("radar_aircraft_tab").style.display = "none"
}

function radarFlightTabSwitch() {
    document.getElementById("radar_radar_tab").style.display = "none"
    document.getElementById("radar_flight_tab").style.display = "block"
    document.getElementById("radar_aircraft_tab").style.display = "none"
}

function radarAircraftTabSwitch() {
    document.getElementById("radar_radar_tab").style.display = "none"
    document.getElementById("radar_flight_tab").style.display = "none"
    document.getElementById("radar_aircraft_tab").style.display = "block"
}

function changeGraphsTime() {
    var time = document.getElementById("graphs_time").value
    document.getElementById("graphs_holder").setAttribute("src", "http://" + window.location.hostname + "/graphs1090/graphs" + graph_types[starting_graph] + time + ".png")
}

function changeGraph(direction) {

    var time = document.getElementById("graphs_time").value
    if (direction && starting_graph != graph_types.length - 1) {
        starting_graph++
        document.getElementById("graphs_holder").setAttribute("src", "http://" + window.location.hostname + "/graphs1090/graphs" + graph_types[starting_graph] + time + ".png")
        console.log(starting_graph)
    } else if (starting_graph != 0) {
        starting_graph = starting_graph - 1
        document.getElementById("graphs_holder").setAttribute("src", "http://" + window.location.hostname + "/graphs1090/graphs" + graph_types[starting_graph] + time + ".png")
        console.log(starting_graph)
    }

    if (starting_graph === graph_types.length - 1) {
        document.getElementById("arrow_forward_graphs").disabled = true;
    } else if (starting_graph === 0) {
        document.getElementById("arrow_back_graphs").disabled = true;
    } else {
        document.getElementById("arrow_back_graphs").disabled = false;
        document.getElementById("arrow_forward_graphs").disabled = false;
    }

    if (starting_graph === 0) {
        document.getElementById("graphs_holder").setAttribute("class", "graphs_s")
    } else if (starting_graph === 7) {
        document.getElementById("graphs_holder").setAttribute("class", "graphs_s")
    } else {
        document.getElementById("graphs_holder").setAttribute("class", "graphs")
    }
}


function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function hsl_col_perc(percent, start, end) {
    var a = percent / 100,
        b = (end - start) * a,
        c = b + start;

    // Return a CSS HSL string
    return 'hsl(' + c + ', 100%, 50%)';
    // hsl_col_perc(bed_percent, 0, 120)
}

function toggleCesium() {
    if (cesuim_active) {
        ol3d.setEnabled(false);
        cesuim_active = false
        document.getElementById("cesium").innerHTML = "language"
    } else {
        ol3d.setEnabled(true);
        cesuim_active = true
        document.getElementById("cesium").innerHTML = "map"
    }
}

