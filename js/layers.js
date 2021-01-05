// -*- mode: javascript; indent-tabs-mode: nil; c-basic-offset: 8 -*-
"use strict";

// Base layers configuration

function createBaseLayers() {
    var layers = [];
    var timestamps = [];
    var online = [];
    var offline = [];
    var aircraft = [];

    online.push(new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: 'osm',
        title: 'Street View (OSM)',
        type: 'base',
    }));


    online.push(new ol.layer.Tile({
        name: 'bing',
        title: 'Dark Street View (Bing)',
        type: 'base',
        source: new ol.source.BingMaps({
            key: keys["Bing"],
            imagerySet: 'CanvasDark',
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            maxZoom: 19
        }),
    }));

    online.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?apiKey=' + keys["hereapi"]
        }),
        name: 'satellite',
        title: 'Satellite',
        type: 'base'
    }));

    online.push(new ol.layer.Tile({
        name: 'bingaerial',
        title: 'Satellite with Labels (Bing)',
        type: 'base',
        source: new ol.source.BingMaps({
            key: keys['Bing'],
            imagerySet: 'AerialWithLabelsOnDemand',
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            maxZoom: 19
        }),
    }));
    if (ChartBundleLayers) {
        var chartbundleTypes = {
            sec: "Sectional Charts",
            tac: "Terminal Area Charts",
            wac: "World Aeronautical Charts",
            enrl: "IFR Enroute Low Charts",
            enra: "IFR Area Charts",
            enrh: "IFR Enroute High Charts"
        };

        for (var type in chartbundleTypes) {
            aircraft.push(new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://wms.chartbundle.com/wms',
                    params: { LAYERS: type },
                    projection: 'EPSG:3857',
                    attributions: 'Tiles courtesy of <a href="http://www.chartbundle.com/">ChartBundle</a>'
                }),
                name: 'chartbundle_' + type,
                title: chartbundleTypes[type],
                type: 'base',
                group: 'chartbundle'
            }));
        }
    }

    offline.push(new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: '/dump1090/tiles/offline-maps/{z}/{x}/{y}.png'
        }),
        name: 'offline',
        title: 'Offline Maps',
        type: 'base'
    }));

    var nexrad = new ol.layer.Tile({
        name: 'nexrad',
        title: 'NEXRAD',
        type: 'overlay',
        opacity: 0.5,
        visible: false
    });
    online.push(nexrad);

    var refreshNexrad = function() {
        // re-build the source to force a refresh of the nexrad tiles
        var now = new Date().getTime();
        nexrad.setSource(new ol.source.XYZ({
            url: 'http://mesonet{1-3}.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_=' + now,
            attributions: 'NEXRAD courtesy of <a href="http://mesonet.agron.iastate.edu/">IEM</a>'
        }));
    };

    refreshNexrad();
    window.setInterval(refreshNexrad, 5 * 60000);


    var radar = new ol.layer.Tile({
        name: 'Radar',
        title: 'Radar',
        type: 'overlay',
    });

    online.push(radar);

    var refreshRadar = function() {
        var apiRequest = new XMLHttpRequest();
        apiRequest.open("GET", "https://api.rainviewer.com/public/maps.json", true);
        apiRequest.onload = function(e) {

            // save available timestamps and show the latest frame: "-1" means "timestamp.lenght - 1"
            timestamps = JSON.parse(apiRequest.response);

            radar.setSource(new ol.source.XYZ({
                url: 'https://tilecache.rainviewer.com/v2/radar/' + timestamps[timestamps.length - 1] + '/256/{z}/{x}/{y}/2/1_1.png',
            }));
        };
        apiRequest.send();
    }

    refreshRadar();
    window.setInterval(refreshRadar(), 10 * 60000);

    if (online.length > 0) {
        layers.push(new ol.layer.Group({
            name: 'Online Maps',
            title: 'Worldwide Online Maps + Overlays',
            layers: online
        }));
    }
    if (aircraft.length > 0) {
        layers.push(new ol.layer.Group({
            name: 'Online Aircraft Maps',
            title: 'Online Aircraft Maps',
            layers: aircraft
        }));
    }

    if (offline.length > 0) {
        layers.push(new ol.layer.Group({
            name: 'Offline Maps',
            title: 'Offline Maps',
            layers: offline
        }));
    }

    return layers;
}