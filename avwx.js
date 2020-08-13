var baseurl = "https://avwx.rest/api/"

function nearestStations(x,y) {
    FetchPending = $.ajax({ url: baseurl + 'metar/'+x+','+y+'?token='+AVWX+'&format=json',
                                    timeout: 5000,
                                    cache: false,
                                    dataType: 'json',
                                    });
        FetchPending.done(function(data) {
            document.getElementById("results").innerHTML = "Station ID: "+data.station
        })
    
}