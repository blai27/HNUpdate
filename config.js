var config = {};

// Crawler default settings
config.crawler = {};

// Consumer update timer: 600 seconds
config.crawler.timer = 600000;

// Consumer limit : 24 hours
config.crawler.limit = 1000 * 60 * 60 * 24;

config.HN = {};

config.HN.base = "hacker-news.firebaseio.com";
config.HN.item = "/v0/item/";
config.HN.maxItem = "/v0/maxitem.json";

config.mongo.url = 'mongodb://localhost:27017/hn-posts';

module.exports = config;