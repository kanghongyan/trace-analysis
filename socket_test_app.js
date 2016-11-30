var express = require('express');
var app     = express();
var server  = app.listen(80);
var fs = require('fs');


app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    //res.send({a:1})
    res.sendFile(__dirname + '/socket_test_index.html');
});





var io = require('socket.io').listen(server);

io.on('connection', function(client) {
    //console.log('Client connected...', client);

    client.on('join', function(data) {
        //console.log(data);
    });
    
    setInterval(()=>{
        client.emit('news', 'news from server');
    }, 10000)
    
    
});

io.of('/upload', function(client){
    console.log('upload')
    logic(client);
})




function logic(socket) {
    var writeStream = null;
    var fileSize = 0;
    var wrote = 0;
    
    socket.on('clientRequestFileTransfer', (fileInfo) => {
        console.log(`Client request file transfer: ${fileInfo.name}(${fileInfo.size})`);
    
        fileSize = fileInfo.size;
        wrote = 0;
    
        writeStream = fs.createWriteStream(__dirname + '/' + fileInfo.name);
        writeStream.on('close', () => {
            console.log('Write stream ended.');
        });
    
        console.log('File created.');
        socket.emit('serverGrantFileTransfer');
    });
    
    socket.on('clientSentChunk', (chunk) => {
        function write() {
            var writeDone = writeStream.write(chunk);
    
            if(!writeDone) {
                console.log('Back pressure!');
                return writeStream.once('drain', write);
            }
            else {
                wrote += chunk.length;
                console.log(`Wrote chunks: ${chunk.length} / ${wrote} / ${fileSize}`);
                socket.emit('serverRequestContinue');
            }
        }
    
        write();        
    });
    socket.on('clientFinishTransmission', () => {
        writeStream.end();
        console.log('Transmission complete!');
    });
    
    
    socket.emit('serverGrantFileTransfer', {});
    
}
