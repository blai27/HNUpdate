(function(){
  "use strict";

  $('#getMaxID').click(function() {
    $.ajax({
      url: '/hour',
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      comeplete: function() {
        console.log('completed');
      },
      success: function(data) {
        console.log(data);
      },
      error: function(err) {
        console.log('reep');
      }
    });
  });

})();