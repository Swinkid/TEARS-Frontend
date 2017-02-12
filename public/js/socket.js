var socket = io('http://localhost');

socket.on('update', function () {
    globalUpdate();
});