var CONTENT_CLASS = ".content";

$(document).ready(function () {
    $('button.close').click(function () {
        $('.properties-bar').addClass("hidden");
        $(CONTENT_CLASS).removeClass("col-sm-7");
        $(CONTENT_CLASS).removeClass("col-md-6");
        $(CONTENT_CLASS).addClass("col-sm-9");
        $(CONTENT_CLASS).addClass("col-md-10");
        google.maps.event.trigger(map, "resize");
    });
});

function openPanel(panelType){
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