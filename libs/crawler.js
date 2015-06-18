var hnapi = require('./hnapi.js');
var model = require('../models/hn-posts.js');

var crawler = {};

crawler.init = function(config) {
  this.timer = config.timer;
  this.limit = config.limit;
  this.startTime = new Date();
  this.reset();
}

crawler.reset = function() {
  this.lastMax = null;
  this.currMax = null;
  this.currMin = null;
  this.range = {};
  this.startTime = new Date();
}

crawler.start = function(fn) {
  var that = this;
  console.log("HN API Background Job: Batch Started");
  this.startTime = new Date();
  model.getIndexRange(function(err, range) {
    that.range = range;
    hnapi.getMaxItem(function(id_string) {
      var id = parseInt(id_string, 10);
      if (that.lastMax === null) {
        if (range) {
          that.lastMax = range.max;  
        } else {
          that.lastMax = 0;
        }
      }
      that.currMax = id;
      that.crawl(id, function() {
        that.lastMax = id;
        fn();
      });
    });
  });
}

crawler.insert = function(item, fn) {
  model.createItem(item, function() {
    fn();
  });
}

crawler.complete = function(fn) {
  console.log("HN API Background Job: Batch Completed");
  var that = this;
  model.removeOldBatches(that.startTime, function() {
    var new_range = {};
    if (that.range) {
      new_range.max = that.currMax;
      new_range.min = that.range.min;
    } else {
      new_range.max = that.currMax;
      new_range.min = that.currMin;
    }
    model.updateIndexRange(new_range, function() {

    });
  });
  fn();
}

crawler.crawl = function(id, fn) {
  var that = this;
  if (that.lastMax < id) {
    hnapi.getItem(id, function(data){
      console.log("HN API Background Job: Retrieving ID: " + id);
      var result = JSON.parse(data);
      if (result === null) {
        setTimeout(function() {
          that.crawl(id-1, fn);
        }, 100);
        return;
      }
      that.parse(result);
      that.currMin = result['id'];
      var startTime = new Date(that.startTime.getTime() - that.limit);
      if (startTime > result['time']) {
        that.complete(fn);
        return;
      } else {
        setTimeout(function() {
          that.crawl(id-1, fn);
        }, 100);
      }
    });
  } else {
    that.complete(fn);
  }
}

crawler.parse = function(item) {
  if (item === null) {
    return;
  }
  if (item['error'] !== undefined && item['error'] === 'Permission denied') {
    return;
  }
  item['time'] = new Date(item['time'] * 1000);
  this.insert(item, function() {

  });
}

module.exports = crawler;