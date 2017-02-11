var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new resourceControl(centerControlDiv, map, "<span class='glyphicon glyphicon-plus'></span>", "Open a new incident ticket.", "resource");

    centerControl.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);

    var centerControlDiv2 = document.createElement('div');
    var centerControl2 = new resourceControl(centerControlDiv, map, "<span class='glyphicon glyphicon-eye-open'></span>", "View resources available.", "incident");

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

function resourceControl(controlDiv, map, buttonText, buttonDescription, panelType) {
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = buttonDescription;
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '20px';
    controlText.style.lineHeight = '38px';
    controlText.style.padding = '5px';
    controlText.innerHTML = buttonText;
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function() {
        openPanel(panelType);
    });
}