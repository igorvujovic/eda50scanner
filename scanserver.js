var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8765);
console.log('listening at 8765')
app.use(express.static('static'))

var sifarnik = {}; // key:[val]
var sken = [] // array of strings, ne -- od arraya
io.on('connection', function (socket) {
  socket.emit('sifarnik', sifarnik );
//  socket.emit('scan', sken.join('\n') );
  socket.emit('scan', sken );

  socket.on('sifarnik', function (data, cb) {
    console.log('stigao sifarnik');
    sifarnik = data;
    if (cb) cb()
    io.emit('sifarnik', sifarnik );
  });

  socket.on('addscan', function (data) {
    console.log('stigao addscan', data);
    sken.splice(0,0,data);
    io.emit('addscan', data)
  });

  socket.on('clearscan', function (data) {
    console.log('clearscan');
    sken=[];
    socket.broadcast.emit('clearscan' );
  });

  socket.on('save2server', function () {
    console.log('save2server');
    socket.broadcast.emit('save2server' );
  });
  
  
});
