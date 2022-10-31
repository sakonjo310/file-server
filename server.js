const net = require("net");

const server = net.createServer();

const fs = require('fs');
const e = require("express");

const baseFolder = '/Users/satoesakonjo/Documents/Lighthouse/webserver/';

server.listen(3000, () => {
    console.log("Server listening on port 3000!")
})

function handleConnection(conn) {    
    var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;  
    console.log('new client connection from %s', remoteAddress);

    conn.setEncoding("utf8");
    conn.on('data', onConnData);  
    conn.once('close', onConnClose);  
    conn.on('error', onConnError);

    function onConnData(d) {  
        console.log('connection data from %s: %j', remoteAddress, d.replace(/\n/gm, ""));  
        // conn.write(d);

        let fileFullPath = baseFolder + d.replace(/\n/gm, "");
 
        fs.readFile(fileFullPath, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            console.log("now serving " + d.replace(/\n/gm, ""));
            conn.write(data); 
          });
          
          
    }

    function onConnClose() {  
        console.log('connection from %s closed', remoteAddress);  
    }

    function onConnError(err) {  
        console.log('Connection %s error: %s', remoteAddress, err.message);  
    }  
}

server.on('connection', handleConnection);