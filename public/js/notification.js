function newNotification(data) {

    if (!("Notification" in window)) {
        //TODO: Need to find a better way of representing this.
        alert("Browser doesn't support notifications.");
    }


    else if (Notification.permission === "granted") {
        generateNotification(data);
    }


    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                generateNotification(data);
            }
        });
    }
}

function generateNotification(data){
    var notification = new Notification('Some Title', {
        title: 'New Call',
        body: data
    });

    notification.onclick = function () {
        //TODO: MOVE MAP, START NEW INCIDENT
        togglePanel("incident");
        notification.close();

    }
}