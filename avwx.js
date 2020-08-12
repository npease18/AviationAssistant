import config from 'keys.json'

var apikey = config.avwx
var baseurl = "https://avwx.rest/api/"

function nearestStations(x,y) {
    FetchPending = $.ajax({ url: baseurl + 'station/near/'+x+','+y+'?n=10&airport=true&reporting=true&format=json?token='+apikey,
                                    timeout: 5000,
                                    cache: false,
                                    dataType: 'json' });
        FetchPending.done(function(data) {
            
        }
    
}