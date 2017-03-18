var CONTENT_CLASS = '.content';
var PROPERTIES_PANEL_CLASS = '.properties-bar';
var propertiesOpen = false;
var lastPanel = '';


$(document).ready(function () {
    $("#newincidentform").submit(function(e){
        e.preventDefault();
    });

    $("#warningmarkersform").submit(function(e){
        e.preventDefault();
    });
});


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

    resetIncidentForm();
    resetIncidentForm();
}

function resetWarningMarkerForm(){
    $("#warningmarkersform").trigger("reset");
}

function resetIncidentForm(){
    $("#newincidentform").trigger("reset");
}

function resetAllIncident() {
    resetIncidentForm();
    resetWarningMarkerForm();
    $('#incidentTabs a[href="#incidentDetails"]').tab('show');
    $('#incidentTabs').find('*').addClass('disabled');
    $('#IncidentSave').removeClass('disabled');
    $('#IncidentReset').removeClass('disabled');
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
    //TODO
}

function saveWarningMaker(){
    //TODO
}

function saveNewIncident(){

    if($("#ilocation").val() != '' && $("#idetails").val() != ''){
        var postData = {
            location : $("#ilocation").val(),
            type : $("#itype").val(),
            status : $("#istatus").val(),
            priority : $("#ipriority").val(),
            details : $("#idetails").val()
        };

        $.post("/api/incident/new", postData).done(function (data) {
            console.log(data);
        });

        $('#incidentTabs a[href="#incidentWarnings"]').tab('show');
        $('#incidentTabs').find('*').removeClass('disabled');
        $('#IncidentSave').addClass('disabled');
        $('#IncidentReset').addClass('disabled');
    } else {
        alert('You\'ve left some fields empty.');
    }
}

function dispatchTab(){
    //TODO
}

function calcTravelTime(locationX, locationY){
    //TODO
}

function refreshResourcesTable(data){
    $('.resourcesList tbody').empty();

    if(data != "Error"){
        $.each(data, function(key, value){

           var differenceString = "";

           var timeDifference = new Date(value['lastUpdated']);

            if (timeDifference.getHours() > 0){
                differenceString += " " + timeDifference.getHours() + " hrs";
            }

            if(timeDifference.getMinutes() >= 1){
                differenceString += " " + timeDifference.getMinutes() + " min";
            }

            if(timeDifference.getSeconds() >= 0 && timeDifference.getMinutes() < 1){
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

    }

}

function globalUpdate(){
    $.getJSON("/api/resources", function (result) {
        updateMarkers(result);
        refreshResourcesTable(result);
    });
}