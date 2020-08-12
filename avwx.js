var baseurl = "https://avwx.rest/api/"

function nearestStations(x,y) {
    FetchPending = $.ajax({ url: baseurl + 'station/near/'+x+','+y+'?n=10&airport=true&reporting=true&format=json?token='+AVWX,
                                    timeout: 5000,
                                    cache: false,
                                    dataType: 'json' });
        FetchPending.done(function(data) {
            document.getElementById("results").innerHTML = data
        })
    
}