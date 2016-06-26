var port = process.env.PORT || 3000,
    fs = require('fs'),
    express = require('express'),
    app = express();

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var oneDay = 86400000;

app.use(express.static(__dirname + '/', { maxAge: oneDay }));
app.use(express.static(__dirname + '/js', { maxAge: oneDay }));
app.use(express.static(__dirname + '/media', { maxAge: oneDay }));

app.listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');