let express = require('express');
let app = express();
let http = require('http');
let server = http.createServer(app);
let io = require('socket.io').listen(server);

let users = [];
let connections = [];
let port = process.env.PORT || 3000;
server.listen(port , ()=>{
	console.log(`Server Listening On Port ${port}`)
});

app.get('/', (req,res)=>{

	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log(`Connected: %s sockets connected`, connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		
     
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
	    console.log(`Disconnected: %s sockets connected`, connections.length);

	});

	//SEND MESSAGE

	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg:data, user:socket.username});
	});

	//NEW USER

	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})

    function updateUsernames(){
    	io.sockets.emit('get users', users);
    }


	
})
