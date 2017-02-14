var socket = io('//frontend.alexnoble.co.uk');

socket.on('update', function () {
    globalUpdate();
});
