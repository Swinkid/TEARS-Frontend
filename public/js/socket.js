var socket = io('//');

socket.on('update', function () {
    globalUpdate();
});

socket.on('notification', function (data) {
    newNotification(data);
});