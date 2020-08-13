var baseurl = "https://avwx.rest/api/"

function nearestStations(x,y) {
    FetchPending = $.ajax({ url: baseurl + 'metar/'+x+','+y+'?'+AVWX+'&format=json',
                    beforeSend: function(request) { 
                        request.setRequestHeader("Authority", AVWX);
                    },
                                    timeout: 5000,
                                    cache: false,
                                    dataType: 'json',
                                    headers: {
                                        "Authorization":AVWX
                                    }});
        FetchPending.done(function(data) {
            document.getElementById("results").innerHTML = data
        })
    
}