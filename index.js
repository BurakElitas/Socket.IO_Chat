var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users=[];
var connections=[];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
})*/;

/*io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});*/

//io.emit('some event', { for: 'everyone' });


io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('Connected:%s sockets Connected',connections.length);

  //Disconnect
  socket.on('disconnect',function(data){
    users.slice(users.indexOf(socket.username),1);
    updateUsernames();
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected: %s sockets connected',connections.length);
  });

  //Send Message
  socket.on('send message',function(data){
    io.sockets.emit('new message',{msg:data});
  });

  socket.on('new user',function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateUsernames();

  });
  function updateUsernames()
  {
    io.sockets.emit('get users',users);
  }
});




http.listen(3000, function(){
  console.log('listening on *:3000');
});