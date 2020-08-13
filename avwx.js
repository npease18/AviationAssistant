var baseurl = "https://avwx.rest/api/"

function nearestStations(x,y) {
    FetchPending = $.ajax({ url: baseurl + 'metar/'+x+','+y+'?token='+AVWX+'&format=json',
                                    timeout: 5000,
                                    cache: false,
                                    dataType: 'json',
                                    });
        FetchPending.done(function(data) {
            json = data
            document.getElementById("metar_data").innerHTML = "Station ID: "+json.station
        })
    
}
