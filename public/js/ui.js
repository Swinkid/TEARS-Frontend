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

    $("#go").submit(function(e){
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
    if($("#ilocation").val() != ''){
        var postData = {
            location: $("#ilocation").val()
        };

        $.post("/api/warning/get", postData).done(function (data) {
            $('#warningmarkerbody').empty();

            var d = JSON.parse(data);

            $.each(d, function(key, value){
                $('#warningmarkerbody').append("<tr>" +
                    "<td>" + value['type'] + "</td>" +
                    "<td>" + value['details'] + "</td>" +
                    "<td>" + "" + "</td>" +
                    "</tr>");
            });
        });
    }
}

function saveWarningMaker(){
    if($("#warningmarkerdetails").val() != ''){
        var postData = {
            location : $("#ilocation").val(),
            type : $('#iwarningtype').val(),
            details : $('#warningmarkerdetails').val()
        };

        $.post("/api/warning/new", postData).done(function (data) {
            $('#warningmarkerbody').append("<tr>" +
                "<td>" + $('#iwarningtype').val() + "</td>" +
                "<td>" + $('#warningmarkerdetails').val() + "</td>" +
                "<td></td>" +
                "</tr>");
        });
    } else {
        alert('Fields have been left empty.')
    }
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
            $('#iid').val(data.id);
        });

        fetchWarnings();
        $('#incidentTabs a[href="#incidentWarnings"]').tab('show');
        $('#incidentTabs').find('*').removeClass('disabled');
        $('#IncidentSave').addClass('disabled');
        $('#IncidentReset').addClass('disabled');
    } else {
        alert('You\'ve left some fields empty.');
    }
}

function dispatchTab(){

    if($('#ilocation').val() !== ''){

        $('#dispatchBody').empty();

        $.ajax({
            contentType: "application/json",
            data: { status : "ONLINE" },
            method: "get",
            url: "/api/resources"
        }).done(function (data) {

            $.each(data, function(index, value){

                $.ajax({
                    contentType: "application/json",
                    data: { start : $('#ilocation').val(), end : value['latestLatitude'] + "," + value['latestLongitude'] },
                    method: "get",
                    url: "/api/incident/travel"
                }).done(function (data) {

                    var id = value['device'];

                    $('#dispatchBody').append("<tr>" +
                        "<td>" + value['callsign'] + "</td>" +
                        "<td>" + value['type'] + "</td>" +
                        "<td>" + value['status'] + "</td>" +
                        "<td>" + $.parseJSON(data).rows[0].elements[0].duration.text + "</td>" +
                        '<td><button id="Dispatch" name="Dispatch" class="btn btn-danger" onclick="dispatch(\'' + $("#iid").val() + '\',\''+ id +'\')">Dispatch</button></td>' +
                        "</tr>");

                });

            });

        });
    }
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

function dispatch(incident, resource) {
    $.ajax({
        data: { device: resource,  incidentId : incident},
        method: "post",
        url: "/api/incident/dispatch"
    }).done(function (data) {
        // TODO OK
    });
}

function globalUpdate(){
    $.getJSON("/api/resources", function (result) {
        updateMarkers(result);
        refreshResourcesTable(result);
    });
}

$("#singlebutton").click(function () {
    var filter = [];

    var $checked = $(".incident-filter:checked"),
        result = $checked.map(function () {
            var $this = $(this);
            return filter.push($this.val());
        });

    alert(JSON.stringify(filter));
});
