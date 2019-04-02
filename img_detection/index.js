var express = require('express');
var app = express();
var http = require('http').Server(app);

//pattern１
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

//pattern2
//app.use(express.static(__dirname + '/public'));
var server = app.listen(3000,'0.0.0.0', function () {
    var host = server.address().address;
      var port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
});
