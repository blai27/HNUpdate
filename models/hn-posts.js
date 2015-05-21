var mongoClient = require('mongodb').MongoClient;
var HNPosts = {};
var db_url = 'mongodb://localhost:27017/hn-posts';
var stats_url = 'mongodb://localhost:27017/hn-posts-stats'

function insertPostBatch(db, batch, callback) {

  var collection = db.collection('hn-posts');
  var instance = {};
  instance.from = batch.max;
  instance.to = batch.min;
  instance.from_time = batch.maxtime;
  instance.to_time = batch.mintime;
  instance.asks = batch.asks;
  instance.stories = batch.stories;
  instance.shows = batch.shows;
  instance.jobs = batch.jobs;
  instance.comments = batch.comments;
  instance.posts = batch.posts;

  collection.insert(instance, function(err, result) {
    if (err === null) {
      console.log('insert completed.');
    }
    callback(result);
  });
}

function getRange(db, callback) {
  var collection = db.collection('hn-posts-stats');
  collection.find().toArray(function(err, docs) {
    console.log(docs);
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
        console.log('range inserted');
      });
    } else {
      var range_stored = docs[0];
      if (range.max >= range_stored.max) {
        range_stored.max = range.max;
      } else if (range.min <= range_stored.min) {
        range_stored.min = range.min;
      }
      collection.remove({}, function(err, result) {
        collection.insert(range_stored, function(err, result) {
          console.log('range updated');
        });
      });
    }
  });
}

HNPosts.createBatch = function(batch, fn) {
  mongoClient.connect(db_url, function(err, db) {
    if (err !== null) {
      console.log("Connection to db failed.");
      fn(err, null);
    }
    insertPostBatch(db, batch, function(result) {
      db.close();
      fn();
    });
  });
}

HNPosts.getIndexRange = function(fn) {
  mongoClient.connect(stats_url, function(err, db) {
    if (err !== null) {
      fn(err, null);
    }
    getRange(db, function(error, result) {
      console.log(result);
      db.close();
    });
  });
}

HNPosts.updateIndexRange = function(range, fn) {
  mongoClient.connect(stats_url, function(err, db) {
    console.log('range connected');
    updateRange(db, range, function(err, result) {
      db.close();
    });
  });
}

module.exports = HNPosts;
