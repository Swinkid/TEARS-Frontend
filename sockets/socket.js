module.exports = function (io){
    setInterval(function () {
        io.emit('update', '');
    }, 1000);
};