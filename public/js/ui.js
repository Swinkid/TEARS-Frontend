var CONTENT_CLASS = ".content";
var PROPERTIES_PANEL_CLASS = ".properties-bar";
var propertiesOpen = false;
var lastPanel = "";

function togglePanel(panelType){
    if(propertiesOpen && lastPanel == panelType){
        togglePanelClosed();
    } else {
        togglePanelOpen();

        switch(panelType){
            case "resource":
                $('.resource').removeClass("hidden");
                globalUpdate();
                break;
            case "incident":
                $('.incident').removeClass("hidden");
                break;
        }
    }

    google.maps.event.trigger(map, "resize");
    propertiesOpen = !propertiesOpen;
    lastPanel = panelType;
}

function togglePanelOpen(){
    $(PROPERTIES_PANEL_CLASS).addClass("hidden");
    $(CONTENT_CLASS).addClass("col-sm-7");
    $(CONTENT_CLASS).addClass("col-md-6");
    $(CONTENT_CLASS).removeClass("col-sm-9");
    $(CONTENT_CLASS).removeClass("col-md-10");
}

function togglePanelClosed() {
    $(PROPERTIES_PANEL_CLASS).addClass("hidden");
    $(CONTENT_CLASS).removeClass("col-sm-7");
    $(CONTENT_CLASS).removeClass("col-md-6");
    $(CONTENT_CLASS).addClass("col-sm-9");
    $(CONTENT_CLASS).addClass("col-md-10");
    google.maps.event.trigger(map, "resize");
}

function fetchWarnings(){
    $("#incidentWarnings").empty();

}

function refreshResourcesTable(data){
    $('.resourcesList tbody').empty();

    if(data != "Error"){
        $.each(data, function(key, value){

            var differenceString = "";

            var timeDifference = value['timeDifference'];

            console.log("UPDATING");

            if (timeDifference.getHours() > 0){
                differenceString += " " + timeDifference.getHours() + " hrs";
            }

            if(timeDifference.getMinutes() > 0){
                differenceString += " " + timeDifference.getMinutes() + " min";
            }

            if(timeDifference.getSeconds() > 0 && timeDifference.getMinutes() < 1){
                differenceString += " " + timeDifference.getSeconds() + " sec";
            }

            $('.resourcesList tbody').append("<tr>" +
                "<td>" + value['callsign'] + "</td>" +
                "<td>" + value['status'] + "</td>" +
                "<td>" + value['type'] + "</td>" +
                "<td>" + differenceString + "</td>" +
                "</tr>");
        });
    } else {
        console.log("ERROR");
    }

}

function globalUpdate(){
    $.getJSON("/api/resources", function (result) {
        updateMarkers(result);
        refreshResourcesTable(result);
    });
}