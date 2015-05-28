var config = {};

// Crawler default settings
config.crawler = {};

// 5 minutes of re-crawl timer
config.crawler.timer = 100000;
config.crawler.limit = 1000 * 60 * 60 * 1;

config.HN = {};

config.HN.base = "hacker-news.firebaseio.com";
config.HN.item = "/v0/item/";
config.HN.maxItem = "/v0/maxitem.json";

module.exports = config;