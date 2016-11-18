var express = require('express');
var app     = express();
var server  = app.listen(80);
var io = require('socket.io');

io = io.listen(server);


app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    //res.send({a:1})
    res.sendFile(__dirname + '/socket_test_index.html');
});




io.on('connection', function(client) {  
    console.log('Client connected...', client);

    client.on('join', function(data) {
        console.log(data);
    });
    
    setInterval(()=>{
        client.emit('news', 'news from server');
    }, 10000)
    
});