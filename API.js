$('.btn').click(function() {

  $('.text').text('loading . . .');

  $.ajax({
    type:"GET",
    url:"http://nflarrest.com/api/v1/",
    success: function(data) {
      $('.text').text(JSON.stringify(data));
    },
    dataType: 'jsonp',
  });

});
