module.exports = function (io){
    setInterval(function () {
        // TODO: Maybe call API call here instead of every client?
        io.emit('update', '');
    }, 1000);
};