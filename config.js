var config = {};

// Crawler default settings
config.crawler = {};

// Re-crawl timer : 600 seconds
config.crawler.timer = 600000;
config.crawler.limit = 1000 * 60 * 60 * 2;

config.HN = {};

config.HN.base = "hacker-news.firebaseio.com";
config.HN.item = "/v0/item/";
config.HN.maxItem = "/v0/maxitem.json";

module.exports = config;