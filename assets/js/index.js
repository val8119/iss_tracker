//selectors
containerP = document.getElementById("current-location");

//listeners
document.addEventListener("DOMContentLoaded", sendAPIRequest);

//functions
function sendAPIRequest() {
    var request = new XMLHttpRequest();

    request.open("GET", "https://api.wheretheiss.at/v1/satellites/25544", true);

    request.onload = function () {
        var data = JSON.parse(this.response);

        console.log(data);

        longitude = data.longitude;
        latitude = data.latitude;

        console.log(latitude, longitude)

        createMap(data.longitude, data.latitude);

        containerP.innerText = `Longitude: ${data.longitude}\nLatitude ${data.latitude}`
    }

    request.send();
}

function createMap(long, lat) {
    var mymap = L.map("map").setView([long, lat], 5);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    var marker = L.marker([long, lat]).addTo(mymap);

    marker.bindPopup("International Space Station").openPopup();
}