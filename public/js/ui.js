var CONTENT_CLASS = ".content";
var propertiesOpen = false;
var lastPanel = "";

function togglePanel(panelType){
    if(propertiesOpen && lastPanel == panelType){
        $('.properties-bar').addClass("hidden");
        $(CONTENT_CLASS).removeClass("col-sm-7");
        $(CONTENT_CLASS).removeClass("col-md-6");
        $(CONTENT_CLASS).addClass("col-sm-9");
        $(CONTENT_CLASS).addClass("col-md-10");
        google.maps.event.trigger(map, "resize");
    } else {
        $('.properties-bar').addClass("hidden");
        $(CONTENT_CLASS).addClass("col-sm-7");
        $(CONTENT_CLASS).addClass("col-md-6");
        $(CONTENT_CLASS).removeClass("col-sm-9");
        $(CONTENT_CLASS).removeClass("col-md-10");

        switch(panelType){
            case "resource":
                $('.resource').removeClass("hidden");
                break;
            case "incident":
                $('.incident').removeClass("hidden");
                break;
        }
    }

    propertiesOpen = !propertiesOpen;
    lastPanel = panelType;
}