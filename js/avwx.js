var baseurl = "https://avwx.rest/api/"

function nearestStations(x, y) {
    FetchPending = $.ajax({
        url: baseurl + 'metar/' + x + ',' + y + '?token=' + keys['AVWX'] + '&options=info&format=json',
        timeout: 5000,
        cache: false,
        dataType: 'json',
    });
    FetchPending.done(function(data) {
        document.getElementById('metar_loading').style.display = "none"
        document.getElementById('metar_data').style.display = "block"
        document.getElementById('station_id').innerHTML = data.station
        document.getElementById('station_name').innerHTML = data.info.name
        document.getElementById('full_metar').innerHTML = data.raw
        document.getElementById('temperature').innerHTML = celciusToF(data.temperature.value).toFixed(1)
        document.getElementById('altimeter').innerHTML = metersToF(data.altimeter.value).toFixed(0) + " Feet"
        document.getElementById('visibility').innerHTML = data.visibility.value + ' Miles'
        document.getElementById('wind_speed').innerHTML = ktsToMPH(data.wind_speed.value).toFixed(0) + ' MPH'
        document.getElementById('wind_direction').innerHTML = numToCompass(data.wind_direction.value)
        if (data.wind_gust) {
            document.getElementById('wind_gusts').innerHTML = data.wind_gust.value + ' kts'
        } else {
            document.getElementById('wind_gusts').innerHTML = 'N/A'
        }
        document.getElementById('dew_point').innerHTML = celciusToF(data.dewpoint.value).toFixed(1)
        document.getElementById('rules').innerHTML = data.flight_rules
        if (data.info.type === 'small_airport') {
            document.getElementById('size').innerHTML = 'Small'
        } else {
            document.getElementById('size').innerHTML = 'Large'
        }
    })

}