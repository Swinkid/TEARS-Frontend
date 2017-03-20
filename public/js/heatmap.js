var map, heatmap;;

var markers = [];


function initHeatMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeControl: true,
        mapTypeId: 'satellite',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_LEFT
        }
    });


    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map,
        radius: 20
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function getPoints() {
    return [new google.maps.LatLng(51.571323, -1.7580683)];
}
