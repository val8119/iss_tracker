//selectors
containerP = document.getElementById("current-location");

//listeners
document.addEventListener("DOMContentLoaded", sendAPIRequest);

//functions
function toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "°" + minutes + "'" + seconds + '"';
}

function sendAPIRequest() {
    var request = new XMLHttpRequest();

    request.open("GET", "https://api.wheretheiss.at/v1/satellites/25544", true);

    request.onload = function () {
        var data = JSON.parse(this.response);

        // converting and formatting timestamp
        let unix_timestamp = data.timestamp;

        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

        // formatting latitude and longitude
        var latitude = toDegreesMinutesAndSeconds(data.latitude);
        var latitudeCardinal = data.latitude >= 0 ? "N" : "S";

        var longitude = toDegreesMinutesAndSeconds(data.longitude);
        var longitudeCardinal = data.longitude >= 0 ? "E" : "W";

        createMap(data.latitude, data.longitude);

        containerP.innerText = `Latitude: ${latitude + " " + latitudeCardinal}\nLongitude: ${longitude + " " + longitudeCardinal}\n${formattedTime + " " + Intl.DateTimeFormat().resolvedOptions().timeZone}`
    }

    request.send();
}

function createMap(lat, long) {
    var mymap = L.map("map").setView([lat, long], 5);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    var marker = L.marker([lat, long]).addTo(mymap);

    marker.bindPopup("International Space Station").openPopup();
}