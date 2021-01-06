function openMetar() {
    document.getElementById("metar_container").style.display = "block"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "none"
    TAB = "METAR"
    var center = ol.proj.toLonLat(OLMap.getView().getCenter(), OLMap.getView().getProjection());
    nearestStations(center[1], center[0])
}

function openRadar() {
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "block"
    document.getElementById("atc_container").style.display = "none"
    TAB = "RADAR"
}

function openATC() {
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "none"
    document.getElementById("atc_container").style.display = "block"
    TAB = "ATC"
    listStations()
}

function readBatteryLevel() {
    FetchPending = $.ajax({
        url: 'data/battery.json',
        timeout: 5000,
        cache: false,
        dataType: 'json'
    });
    FetchPending.done(function(data) {
        document.getElementById("percentage").innerHTML = data.percentage[0].level + "%"
        battery = data.adapter[0].status
        if (battery === "in") {
            document.getElementById('battery').innerHTML = "battery_charging_full"
            console.log("charging")
        } else if (data.percentage[0].level < 21) {
            document.getElementById('battery').innerHTML = "battery_alert"
            console.log("low")
        } else {
            document.getElementById('battery').innerHTML = "battery_full"
            console.log("full")
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
    xhr.open("POST", "http://127.0.0.1:5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
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
    xhr.open("POST", "http://127.0.0.1:5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response)
            document.getElementById("volume_level").innerHTML = xhr.response
        }
    }
    xhr.send(JSON.stringify({
        direction: 0
    }));
}

function getInitialVolume() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/audio", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log(xhr.response)
            document.getElementById("volume_level").innerHTML = xhr.response
        }
    }
    xhr.send(JSON.stringify({
        direction: 2
    }));
}

function readBrightnessLevel() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/brightness", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
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
            xhr.open("POST", "http://127.0.0.1:5000/brightness", true);
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
            xhr.open("POST", "http://127.0.0.1:5000/brightness", true);
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

function sendCMD(cmd) {
    if (cmd === "update") {
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.response + "A")
                if (xhr.response.substring(0, 19) === "Already up to date.") {
                    var snackbarContainer = document.getElementById('no-updates-snackbar');
                    var data = { message: 'Already Up To Date!' };
                    snackbarContainer.MaterialSnackbar.showSnackbar(data);
                } else {
                    var snackbarContainer = document.getElementById('no-updates-snackbar');
                    var data = { message: 'Updating...' };
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
        xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
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
        var data = { message: 'Shutting Down...' };
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
        var output = ""
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log(xhr.response)
                output = xhr.response
            }
        }
        xhr.send(JSON.stringify({
            command: "cd /usr/local/bin && sudo x728softsd.sh"
        }));
        console.log(output)
    }


}

function changeBranch(branch) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:5000/cmd", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        command: "git checkout " + branch
    }));
    sendCMD("getbranch")
}

function goHome() {
    document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "block"
    document.getElementById("settings_page").style.display = "none"
}

function goRadar() {
    document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("radar_page").style.display = "block"
    document.getElementById("home_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"
}

function goItinerary() {
    document.getElementById("itinerary_page").style.display = "block"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "none"
    document.getElementById("settings_page").style.display = "none"
}

function goSettings() {
    document.getElementById("itinerary_page").style.display = "none"
    document.getElementById("settings_page").style.display = "block"
    document.getElementById("radar_page").style.display = "none"
    document.getElementById("home_page").style.display = "none"
}