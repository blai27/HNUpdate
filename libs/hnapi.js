var https = require('https');

var hnapi = {};

hnapi.init = function(hnconf) {
  this.base = hnconf.base;
  this.item = hnconf.item;
  this.maxItem = hnconf.maxItem;
}

hnapi.getItem = function(id, fn) {
  var options = { host: this.base, 
                  path: this.item + id + ".json" };

  requestHN(options, fn);  
}

hnapi.getMaxItem = function(fn) {
  var options = { host: this.base, 
                  path: this.maxItem };
  
  requestHN(options, fn);
}

function requestHN(options, fn) {
  var request = https.get(options, function(res){

    var output = '';

    res.on('data', function(data){
      output += data;    
    });

    res.on('end', function(){
      if (fn) {
        fn(output);
      }
    });
  });

  request.on('error', function(e){
    console.error(e);
  });
}

module.exports = hnapi;