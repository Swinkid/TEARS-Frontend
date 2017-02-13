var socket = io('//localhost');

socket.on('update', function () {
    globalUpdate();
});