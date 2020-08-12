function openMetar() {
    document.getElementById("metar_container").style.display = "block"
    document.getElementById("radar_container").style.display = "none"
}

function openRadar() {
    document.getElementById("metar_container").style.display = "none"
    document.getElementById("radar_container").style.display = "block"
}

function readBatteryLevel() {
    FetchPending = $.ajax({ url: 'data/battery.json',
                                timeout: 5000,
                                cache: false,
                                dataType: 'json' });
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
    })

}
