var net = require('net');
var sockets = [];
var port = 6969;
var guestId = 0;

var server = net.createServer(function(socket) {
	// Increment
	guestId++;
	
	socket.nickname = "Guest" + guestId;
	var clientName = socket.nickname;

	sockets.push(socket);

	// Log it to the server output
	console.log(clientName + ' joined this chat.');

	// Welcome user to the socket
	//socket.write("Welcome to telnet chat!\n");



	// When client sends data
	socket.on('data', function(data) {

		var message = data;

		broadcast(clientName, message);

		// Log it to the server output
		logDataStream(data)
	});


	// When client leaves
	socket.on('end', function() {

		var message = clientName + ' left this chat\n';

		// Log it to the server output
		process.stdout.write(message);

		// Remove client from socket array
		removeSocket(socket);

	});


	// When socket gets errors
	socket.on('error', function(error) {

		console.log('Socket got problems: ', error.message);

	});
});

// Broadcast to others, excluding the sender
function broadcast(from, message) {

	// If there are no sockets, then don't broadcast any messages
	if (sockets.length === 0) {
		process.stdout.write('Everyone left the chat');
		return;
	}

	// If there are clients remaining then broadcast message
	sockets.forEach(function(socket, index, array){
		// Dont send any messages to the sender
		if(socket.nickname === from) return;
		socket.write(message);
	});
	
};

// Remove disconnected client from sockets array
function removeSocket(socket) {

	sockets.splice(sockets.indexOf(socket), 1);

};


function logDataStream(data){  
  // log the binary data stream in rows of 8 bits
  var print = "";
  for (var i = 0; i < data.length; i++) {
    print += " " + data[i].toString(16);

    // apply proper format for bits with value < 16, observed as int tuples
    if (data[i] < 16) { print += "0"; }

    // insert a line break after every 8th bit
    if ((i + 1) % 8 === 0) {
      print += '\n';
    };
  }

  // log the stream
  console.log(print);
}

// Listening for any problems with the server
server.on('error', function(error) {

	console.log("So we got problems!", error.message);

});

// Listen for a port to telnet to
// then in the terminal just run 'telnet localhost [port]'
server.listen(port, function() {

	console.log("Server listening at http://localhost:" + port);

});
