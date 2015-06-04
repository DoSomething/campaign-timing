var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules/dosomething-neue/dist'));

var sassMiddleware = require('node-sass-middleware');
var path = require('path');
app.use(sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));

var reload = require('reload');
var http = require('http');
var server = http.createServer(app);
reload(server, app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var campaignFilter = require(__dirname + '/lib/campaign_filter.js');
console.log("Importing campaigns");
var campaignImporter = require(__dirname + '/lib/campaign_import.js')(function onImport(campaigns) {
  global.CAMPAIGNS = campaigns;
  console.log("Campaigns Imported");
  server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
});
