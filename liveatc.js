function playPLS(airport) {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var request = $.ajax({ url: 'liveatc.json',
                                timeout: 5000,
                                cache: true,
                                dataType: 'json' });
    request.done(function(data) {
        var link = data["Maine"].airports.KBGR.feeds["1"].url
        fetch(proxyurl + 'http://www.liveatc.net'+link, {mode: 'cors'})
        .then(response => response.text())
        .then(native => native.split('\n'))
        .then(split => split[1])
        .then(data => data.substring(6, data.length))
        .then(url => document.getElementById("player").setAttribute("src", url))
        .then(dat => document.getElementById("player").load())
    })
}

function listStations() {
    
}