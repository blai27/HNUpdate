var hnapi = require('./hnapi.js');
var model = require('../models/hn-posts.js');

var crawler = {};

crawler.init = function(config) {
  this.timer = config.timer;
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
}

crawler.start = function(fn) {
  var that = this;
  console.log('Crawler started.');
  hnapi.getMaxItem(function(id_string) {
    var id = parseInt(id_string, 10);
    if (that.lastMax === undefined) {
      that.lastMax = id;
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
}

crawler.crawl = function(id, fn) {
  var that = this;
  if (that.lastMax < id) {
    hnapi.getItem(id, function(data){
      console.log("Retrieved post: " + id);
      var result = JSON.parse(data);
      that.parse(result, id);
      setTimeout(function() {
        that.crawl(id-1, fn);
      }, 1000);
    });
  } else {
    console.log("Crawler completed");
    if (that.batch.posts.length > 0) {
      model.createBatch(that.batch, function() {
        console.log('batch created');
        var range = {};
        range.max = that.batch.max;
        range.min = that.batch.min;
        model.updateIndexRange(range, function() {
          console.log('WUT');
        });
      });
    }
    fn();
  }
}

crawler.parse = function(item, id) {

  if (item['error'] !== undefined && item['error'] === 'Permission denied') {
    this.batch.posts.push(item);
    return;
  }

  if (this.batch.max === id && this.batch.min === id) {
    this.batch.maxtime = item['time'];
    this.batch.mintime = item['time'];
  } else if (this.batch.min === id) {
    this.batch.mintime = item['time'];
  } else if (this.batch.max === id) {
    this.batch.maxtime = item['time'];
  }

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