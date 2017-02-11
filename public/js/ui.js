$(document).ready(function () {
    $('button.close').click(function () {
        $('.properties-bar').addClass("hidden");
        $('.content').removeClass("col-sm-7");
        $('.content').removeClass("col-md-6");
        $('.content').addClass("col-sm-9");
        $('.content').addClass("col-md-10");
        google.maps.event.trigger(map, "resize");
    })
});