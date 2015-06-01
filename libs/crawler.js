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
  this.batch = {};
  this.batch.max = null;
  this.batch.min = null;
  this.batch.maxtime = null;
  this.batch.mintime = null;
  this.batch.posts = [];
  this.batch.asks = 0;
  this.batch.stories = 0;
  this.batch.shows = 0;
  this.batch.jobs = 0;
  this.batch.comments = 0;
  this.startTime = new Date();
  this.batch.currentMin = null;
}

crawler.start = function(fn) {
  var that = this;
  console.log('Crawler started.');
  this.startTime = new Date();
  model.getIndexRange(function(err, range) {
    hnapi.getMaxItem(function(id_string) {
      var id = parseInt(id_string, 10);
      if (that.lastMax === undefined) {
        that.lastMax = range.max;
      }
      that.batch.max = id;
      if (that.lastMax === id) {
        that.batch.min = id;
      } else {
        that.batch.min = that.lastMax + 1;
      }
      that.crawl(id, function() {
        that.lastMax = id;
        fn();
      });
    });
  });
}

crawler.crawl = function(id, fn) {
  var that = this;
  if (that.lastMax < id) {
    hnapi.getItem(id, function(data){
      console.log("Retrieved post: " + id);
      var result = JSON.parse(data);
      if (result === null) {
        setTimeout(function() {
          that.crawl(id-1, fn);
        }, 100);
        return;
      }
      that.batch.currentMin = id;
      that.parse(result, id);
      var startTime = new Date(that.startTime.getTime() - that.limit);
      if (startTime > result['time']) {
        that.crawl(that.lastMax, fn);
      } else {
        setTimeout(function() {
          that.crawl(id-1, fn);
        }, 100);
      }
    });
  } else {
    console.log("Crawler completed");
    if (that.batch.posts.length > 0) {
      that.batch.min = that.batch.currentMin;
      model.createBatch(that.batch, function() {
        var range = {};
        range.max = that.batch.max;
        range.min = that.batch.min;
        model.removeOldBatches(new Date(), function() {
          model.updateIndexRange(range, function() {
            
          });
        });
      });
    }
    fn();
  }
}

crawler.parse = function(item, id) {
  if (item === null) {
    this.batch.posts.push(item);
    return;
  }
  if (item['error'] !== undefined && item['error'] === 'Permission denied') {
    this.batch.posts.push(item);
    return;
  }
  item['time'] = new Date(item['time'] * 1000);
  if (this.batch.max === id) {
    this.batch.maxtime = item['time'];
  }
  this.batch.mintime = item['time'];

  if (item['type'] === 'story') {
    if (item['title'] !== undefined) {
      if (item['title'].indexOf('Ask HN:') !== -1) {
        this.batch.asks += 1;
      } else if (item['title'].indexOf('Show HN:') !== -1) {
        this.batch.shows += 1;
      } else {
        this.batch.stories += 1;
      }
    }
  } else if (item['type'] === 'comment') {
    this.batch.comments += 1;
  } else if (item['type'] === 'job') {
    this.batch.jobs += 1;
  }
  this.batch.posts.push(item);
}

module.exports = crawler;