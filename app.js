var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express();

var VIDEO_BASE = 'https://www.youtube.com/watch?v=';
var id = '-Z8RyzSVGOs';
var url = VIDEO_BASE + id;

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var oneDay = 86400000;

app.use(express.static(__dirname + '/', { maxAge: oneDay }));
app.use(express.static(__dirname + '/js', { maxAge: oneDay }));
app.use(express.static(__dirname + '/media', { maxAge: oneDay }));

app.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');