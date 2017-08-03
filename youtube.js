var prefs = {
  query: {
    part: 'snippet',
    key: 'AIzaSyCd5PGpySEB1CENu8NknoOLUe8w1OaCrFY',
    maxResults: 1,
    pageToken: '',
    type: 'video',
    q: ''
  },
  youtubeUrl: 'https://www.googleapis.com/youtube/v3/search',
};

function findPlayer(name, category) {
  prefs.query.q = name + " " + category ; //change settings object query.q to user input
  console.log(prefs)
  getAPIdata(prefs, showResults);
}

//API call
function getAPIdata(settings, callback) {
  $.getJSON(settings.youtubeUrl, settings.query, callback);
  console.log(callback)
}

function showResults(data) {
    if (!data.items[0]) {
      $('.video').html('<div>Sorry no video found</div>');

    } else {
      $('.video').html('<iframe src="https://www.youtube.com/embed/' + data.items[0].id.videoId + '"frameborder="0"></iframe><p>' + data.items[0].snippet.title + '</p>');
    }
      console.log(data);


       	//$.each(data.items, function(index, item) {
       		//videoHTML += '<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/' + item.id.videoId + '"frameborder="0"></iframe>';
       		//videoHTML += '<p>' + item.snippet.title + '</p></div>';

       	//});


}
