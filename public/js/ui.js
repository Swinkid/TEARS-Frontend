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

function fetchIncidentDispatch(){

}