// --------------------------------------------------------
//
// This file is to configure the configurable settings.
// Load this file before script.js file at gmap.html.
//
// --------------------------------------------------------

// API KEYS
var keys = {}
// API Keys
var xhr = new XMLHttpRequest();
xhr.open("GET", "information/keys.json", true);
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        keys = JSON.parse(xhr.response)
    }
}
xhr.send();


var ol3d
var internet_mode = 0
var lastMETAR = 0
var lastItin = 0
var liveATC = 0
var exclude = 1
var text_labels = 1

var country_names = {}
var xhr1 = new XMLHttpRequest();
xhr1.open("GET", "json/country_names.json", true);
xhr1.setRequestHeader('Content-Type', 'application/json');
xhr1.onreadystatechange = function () {
    if (xhr1.readyState === 4) {
        country_names = JSON.parse(xhr1.response)
    }
}
xhr1.send();

var flight_info = {}
var TAB = "Radar"
//var DateTime = luxon.DateTime;
var graph_types = ["/dump1090-localhost-local_trailing_rate-", "/dump1090-localhost-aircraft-", "/dump1090-localhost-tracks-", "/dump1090-localhost-signal-", "/dump1090-localhost-local_rate-", "/dump1090-localhost-aircraft_message_rate-", "/dump1090-localhost-cpu-", "/system-localhost-cpu-", "/system-localhost-temperature-", "/system-localhost-memory-", "/system-localhost-network_bandwidth-", "/system-localhost-df_root-", "/system-localhost-disk_io_iops-", "/system-localhost-disk_io_octets-"]
/* var graph_types = {
    "ADSB Message Rate": "/dump1090-localhost-local_trailing_rate-",
    "Aircraft Seen": "/dump1090-localhost-aircraft-",
    "Track's Seen (8 Minute Moving Average)": "/dump1090-localhost-tracks-",
    "Signal Level": "/dump1090-localhost-signal-",
    "ADS-B Maxima": "dump1090-localhost-local_rate-",
    "Message Rate / Aircraft": "/dump1090-localhost-aircraft_message_rate-",
    "ADS-B CPU Usage": "/dump1090-localhost-cpu-",
    "Overall CPU Usage": "/system-localhost-cpu-",
    "Max Core Temp": "/system-localhost-temperature-",
    "Memory Usage": "/system-localhost-memory-",
    "Bandwidth Usage": "/system-localhost-network_bandwidth-",
    "Disk Usage": "/system-localhost-df_root-",
    "Disk I/O - IOPS": "/system-localhost-disk_io_iops-",
    "Disk I/O - Bandwidth": "/system-localhost-disk_io_octets-"

} */
var starting_graph = 0

// -- Title Settings --------------------------------------
// Show number of aircraft and/or messages per second in the page title
PlaneCountInTitle = true;
MessageRateInTitle = false;

// -- Output Settings -------------------------------------
// Show metric values
// The Metric setting controls whether metric (m, km, km/h) or
// imperial (ft, NM, knots) units are used in the plane table
// and in the detailed plane info. If ShowOtherUnits is true,
// then the other unit will also be shown in the detailed plane
// info.
Metric = false;
ShowOtherUnits = true;

// -- Map settings ----------------------------------------
// These settings are overridden by any position information
// provided by dump1090 itself. All positions are in decimal
// degrees.

// Default center of the map.
DefaultCenterLat = 44.845;
DefaultCenterLon = -69.344;
// The google maps zoom level, 0 - 16, lower is further out
DefaultZoomLvl = 7;

// Center marker. If dump1090 provides a receiver location,
// that location is used and these settings are ignored.

SiteShow = false; // true to show a center marker
SiteLat = 45.0; // position of the marker
SiteLon = 9.0;
SiteName = "My Radar Site"; // tooltip of the marker

// -- Marker settings -------------------------------------

// These settings control the coloring of aircraft by altitude.
// All color values are given as Hue (0-359) / Saturation (0-100) / Lightness (0-100)
ColorByAlt = {
    // HSL for planes with unknown altitude:
    unknown: {
        h: 0,
        s: 0,
        l: 40
    },

    // HSL for planes that are on the ground:
    ground: {
        h: 120,
        s: 100,
        l: 30
    },

    air: {
        // These define altitude-to-hue mappings
        // at particular altitudes; the hue
        // for intermediate altitudes that lie
        // between the provided altitudes is linearly
        // interpolated.
        //
        // Mappings must be provided in increasing
        // order of altitude.
        //
        // Altitudes below the first entry use the
        // hue of the first entry; altitudes above
        // the last entry use the hue of the last
        // entry.
        h: [{
                alt: 2000,
                val: 20
            }, // orange
            {
                alt: 10000,
                val: 140
            }, // light green
            {
                alt: 40000,
                val: 300
            }
        ], // magenta
        s: 85,
        l: 50,
    },

    // Changes added to the color of the currently selected plane
    selected: {
        h: 0,
        s: -10,
        l: +20
    },

    // Changes added to the color of planes that have stale position info
    stale: {
        h: 0,
        s: -10,
        l: +30
    },

    // Changes added to the color of planes that have positions from mlat
    mlat: {
        h: 0,
        s: -10,
        l: -10
    }
};

// For a monochrome display try this:
// ColorByAlt = {
//         unknown :  { h: 0, s: 0, l: 40 },
//         ground  :  { h: 0, s: 0, l: 30 },
//         air :      { h: [ { alt: 0, val: 0 } ], s: 0, l: 50 },
//         selected : { h: 0, s: 0, l: +30 },
//         stale :    { h: 0, s: 0, l: +30 },
//         mlat :     { h: 0, s: 0, l: -10 }
// };

// Outline color for aircraft icons with an ADS-B position
OutlineADSBColor = '#000000';

// Outline color for aircraft icons with a mlat position
OutlineMlatColor = '#4040FF';

SiteCircles = true; // true to show circles (only shown if the center marker is shown)
// In nautical miles or km (depending settings value 'Metric')
SiteCirclesDistances = new Array(100, 150, 200);

// Show the clocks at the top of the righthand pane? You can disable the clocks if you want here
ShowClocks = false;

// Controls page title, righthand pane when nothing is selected
PageName = "Aviation Assistant";

// Show country flags by ICAO addresses?
ShowFlags = true;

// Path to country flags (can be a relative or absolute URL; include a trailing /)
FlagPath = "flags-tiny/";

// Set to true to enable the ChartBundle base layers (US coverage only)
ChartBundleLayers = true;