module.exports = function (io) {
    var intervalTime = 1000;

    setInterval(function () {
        // TODO: Maybe call API call here instead of every client?
        io.emit('update', '');
    }, intervalTime);
};