// "Accepts "charging" and "low", sets percentage
function updateBattery() {
    var battery = ""
    var percentage = "59%"
    var status = document.getElementById("battery")

    if (battery === "charging") {
        status.innerHTML = "battery_charging_full"
    } else if (battery === "low") {
        status.innerHTML = "battery_alert"
    } else {
        status.innerHTML = "battery_full"
    }

    document.getElementById("percentage").innerHTML = percentage
    //componentHandler.upgradeElement(status);
}
