var express = require('express'), app = express(), server = require('http').Server(app);
var io = require('socket.io')(server), beardcomb = require('beardcomb'), path = require('path'), port = process.env.PORT || 3000;

app.engine('html', beardcomb);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) { 
    res.render('index', {locals: { title: 'WiggleChat', conn: port != 3000 ? 'https://wigglechat.herokuapp.com:80': 'http://localhost:3000' }, foundation: 'layout'}); 
});

io.on('connection', function(socket){
    function setSocket(data, socketId) { data.user = socketId; return data }

    socket.broadcast.emit('newUser', socket.id);
    socket.on( 'addPath', function(data) { socket.broadcast.emit('addPath', setSocket(data, socket.id)); });
    socket.on( 'addOtherPaths', function(data) { socket.broadcast.to(data.originSock).emit('addPath', setSocket(data, socket.id)); });
    socket.on('chat', function(msg){ io.emit('chat', msg); });
    socket.on('disconnect', function() { socket.broadcast.emit('userDrop', socket.id); });
});

server.listen(port, function() { console.log('listening on ' + port + '/'); });
