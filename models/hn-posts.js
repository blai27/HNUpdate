var configs = require('../config.js');

var mongoClient = require('mongodb').MongoClient;
var HNPosts = {};
var db_url = configs.mongo.url;

function insertPostItem(db, item, callback) {
  var collection = db.collection('hn-posts');
  collection.insert(item, function(err, result) {
    callback(err, result);
  });
}

function getRange(db, callback) {
  var collection = db.collection('hn-posts-stats');
  collection.find().toArray(function(err, docs) {
    var range = null;
    if (docs.length > 0) {
      range = docs[0];
    }
    callback(err, range);
  });
}

function removePostBatches(db, currTime, callback) {
  var collection = db.collection('hn-posts');
  var collection_stats = db.collection('hn-posts-stats');
  var evictTime = new Date(currTime.getTime() - configs.crawler.limit);
  collection.remove({time: {$lt: evictTime}}, function(err, result) {
    collection_stats.remove({}, function(error, result) {
      callback(error, result);
    });
  });
}

function updateRange(db, range, callback) {
  var collection = db.collection('hn-posts-stats');
  collection.find().toArray(function(err, docs) {
    if (docs.length === 0) {
      var instance = {};
      instance.max = range.max;
      instance.min = range.min;
      collection.insert(instance, function(err, result) {
      });
    } else {
      var range_stored = docs[0];
      if (range.max >= range_stored.max) {
        range_stored.max = range.max;
      } else if (range.min <= range_stored.min) {
        range_stored.min = range.min;
      }
      collection.remove({}, function(err, result) {
        if (err === null) {
          collection.insert(range_stored, function(err, result) {
            callback(err, result);
          });
        } else {
          callback(err, result);
        }
      });
    }
  });
}

function getHourly(db, callback) {
  var collection = db.collection('hn-posts');
  var currTime = new Date();
  var minusHour = new Date(currTime.getTime() - 1000 * 60 * 60 * 1);
  var criteria = {time: {$gt: minusHour}};
  collection.find(criteria).toArray(function(err, docs) {
    callback(err, docs);
  });
}

HNPosts.createItem = function(item, fn) {
  mongoClient.connect(db_url, function(err, db) {
    if (err !== null) {
      console.log("Connection to db failed.");
      fn(err, null);
    }
    insertPostItem(db, item, function(result) {
      db.close();
      fn();
    });
  });
}

HNPosts.getIndexRange = function(fn) {
  mongoClient.connect(db_url, function(err, db) {
    if (err !== null) {
      fn(err, null);
    }
    getRange(db, function(error, result) {
      db.close();
      fn(error, result);
    });
  });
}

HNPosts.updateIndexRange = function(range, fn) {
  mongoClient.connect(db_url, function(err, db) {
    updateRange(db, range, function(err, result) {
      db.close();
      fn(err, result);
    });
  });
}

HNPosts.removeOldBatches = function(currTime, fn) {
  mongoClient.connect(db_url, function(err, db) {
    removePostBatches(db, currTime, function(error, result) {
      db.close();
      fn(error, result);
    });
  });
}

HNPosts.getHourlyPosts = function(fn) {
  mongoClient.connect(db_url, function(err, db) {
    getHourly(db, function(error, result) {
      db.close();
      fn(error, result);
    });
  });
}

module.exports = HNPosts;
