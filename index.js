var packetType = require("./Enums/packetType")

// port to listen to
var PORT = 11000; // Change to your port number

// Load datagram module
var dgram = require('dgram');

// Create a new instance of dgram socket
var server = dgram.createSocket('udp4');

/**
Once the server is created and binded, some events are automatically created.
We just bind our custom functions to those events so we can do whatever we want.
*/

// Listening event. This event will tell the server to listen on the given address.
server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

// Message event. This event is automatically executed when this server receives a new message
// That means, when we use FUDPPing::UDPEcho in Unreal Engine 4 this event will trigger.
server.on('message', function (message, remote) {
    try {
        var JSONData = JSON.parse(message)
    } catch (error) {
        var JSONData = {packetType: -1}
    }
    
    if(JSONData.packetType === packetType.PING){
        console.log(`Recieved PING from ${remote.address}:${remote.port}, echoing back.`)
        server.send(message, 0, message.length, remote.port, remote.address, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + remote.address +':'+ remote.port + '\n');
        });
    }
});

// Error event. Something bad happened. Prints out error stack and closes the server.
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

// Finally bind our server to the given port and host so that listening event starts happening.
server.bind(PORT);