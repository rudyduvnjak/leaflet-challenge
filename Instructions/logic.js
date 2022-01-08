// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var queryUrl2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</h3><hr><h3>Date & Time:</h3><p> ${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            let magnitude = feature.properties.mag * 8;
            if (feature.geometry.coordinates[2] > 90) {
                fillcolor = '#800000';
            }
            else if (feature.geometry.coordinates[2] >= 70) {
                fillcolor = '#990000';
            }
            else if (feature.geometry.coordinates[2] >= 50) {
                fillcolor = '#b30000';
            }
            else if (feature.geometry.coordinates[2] >= 30) {
                fillcolor = '#ff1a1a';
            }
            else if (feature.geometry.coordinates[2] >= 10) {
                fillcolor = '#ff4d4d';
            }
            else fillcolor = "#ff9999";
            return L.circleMarker(latlng, {
                radius: magnitude,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });

        }

    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": streetMap,
        "Topographic Map": topoMap
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetMap, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    // Add Legend for Earthquake depth
    
    //Legend specific to each earthquake depth
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth</h4>";
    div.innerHTML += '<i style="background: #800000"></i><span>90 +</span><br>';
    div.innerHTML += '<i style="background: #990000"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style="background: #b30000"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style="background: #ff1a1a"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #ff4d4d"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style="background: #ff9999"></i><span>< 10</span><br>';
    //div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
    
    return div;
    };
    //Add legend to the map
    legend.addTo(myMap);

}

