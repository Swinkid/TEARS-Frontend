var map, map2, heatmap;

var markers = [];


var heatmap;

function updateMarkers(data){
    clearMarkers();

    if(data != "Error"){
        $.each(data, function(key, value){
            if(value.status != "OFFLINE"){
                var location = { lat : parseFloat(value.latestLatitude), lng : parseFloat(value.latestLongitude)};

                var marker = new google.maps.Marker({
                    position: location,
                    map: map
                });

                markers.push(marker);
            }
        });
    }

}

function moveMapCenter(lat, lng){
    var point = new google.maps.LatLng(lat, lng);

    map.panTo(point)
}

function clearMarkers(){
    for(var i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_LEFT
        }
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new resourceControl(centerControlDiv, map, "<span class='glyphicon glyphicon-plus'></span>", "Open a new incident ticket.", "incident", "#f8f8f8");

    centerControl.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    var centerControlDiv2 = document.createElement('div');
    var centerControl2 = new resourceControl(centerControlDiv, map, "<span class='glyphicon glyphicon-eye-open'></span>", "View resources available.", "resource", "#f8f8f8");

    centerControl2.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv2);

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

function resourceControl(controlDiv, map, buttonText, buttonDescription, panelType, bgColor) {
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = bgColor;
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = buttonDescription;
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontSize = '20px';
    controlText.style.padding = '10px';
    controlText.innerHTML = buttonText;
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        togglePanel(panelType);
    });
}

function initHeatMap(){
    map2 = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeControl: true,
        mapTypeId: 'satellite',
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_LEFT
        }
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: null,
        radius: 20
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map2.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    getPoints();
}

function getPoints() {
    $.ajax({
        contentType: "application/json",
        data: {},
        method: "get",
        url: "/api/incidents"
    }).done(function (data) {
        var heat = [];

        $.each(data, function (key, point) {
            heat.push(new google.maps.LatLng(point.lat, point.long));
        });

        var heatArray = new google.maps.MVCArray(heat);
        heatmap.setData(heatArray);
        heatmap.setMap(map2);
    });
}