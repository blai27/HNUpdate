var background = {};
var crawler = require('./crawler.js');

background.init = function(config) {
  crawler.init(config);
  this.timer = config.timer;
}

background.start = function() {
  var that = this;
  crawler.start(function(res) {
    setTimeout(function(){
      crawler.reset();
      that.start();
    }, that.timer);  
  });
}

module.exports = background;