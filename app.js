var port = process.env.PORT || 5555,
    fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express();

var privateKey = fs.readFileSync('cert/client-key.pem');
var certificate = fs.readFileSync('cert/cert.pem');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var oneDay = 86400000;
app.use(express.static(__dirname + '/', { maxAge: oneDay }));
app.use(express.static(__dirname + '/js', { maxAge: oneDay }));
app.use(express.static(__dirname + '/media', { maxAge: oneDay }));

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);

app.listen(3000);

console.log('Server running at https://127.0.0.1:' + port + '/');
console.log('Server running at http://127.0.0.1:' + 3000 + '/');