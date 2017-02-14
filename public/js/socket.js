var socket = io('//frontend.alexnoble.co.uk', {secure: true});

socket.on('update', function () {
    globalUpdate();
});