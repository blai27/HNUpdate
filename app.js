var express = require('express');
var configs = require('./config.js');
var hnapi = require('./libs/hnapi.js');
var background = require('./libs/background.js');
var model = require('./models/hn-posts.js');

var app = express();

app.use(express.static('./views'));

hnapi.init(configs.HN);
background.init(configs.crawler);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

app.get('/hour', function(req, res) {
  var response = res;
  model.getHourlyPosts(function(err, docs) {
    response.send(docs);
  });
});

background.start();

app.listen(3000);

