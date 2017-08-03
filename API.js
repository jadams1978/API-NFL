function makeApiCall(url) {
  $.ajax({
    type:"GET",
    dataType: 'json',
    url: url,
    success: function(data) {
      let HTML = "";
      console.log(data);
      for(var i=0; i<data.length; i++){
        console.log(data[i]);
        console.log(data[i].Team_name)
        HTML +=
          `<div class="record">
            <div class="player" data-name="${data[i].Name}"><span>Player: </span>${data[i].Name}</div>
            <div class="position"><span>Position: </span>${data[i].Position_name}</div>
            <div class="year"><span>Year: </span>${data[i].Year}</div>
            <div class="category" data-category="${data[i]["Category"]}"><span>Category: </span>${data[i]["Category"]}</div>
            <div class="description"><span>Description: </span>${data[i].Description}</div>






          </div>`;


      }
      $('.text').html(HTML);

      youTubeClick();
    },
    fail: function (err){console.log(err)}

  });


}

const teams = {'cardinals': 'ARI', 'falcons': 'ATL', 'ravens': 'BAL', 'bills': 'BUF', 'panthers': 'CAR', 'bears': 'CHI', 'bengals': 'CIN', 'browns': 'CLE', 'cowboys': 'DAL', 'broncos': 'DEN', 'lions': 'DET', 'packers': 'GB', 'texans': 'HOU', 'colts': 'IND', 'jaguars': 'JAC', 'chiefs': 'KC', 'chargers': 'LAC', 'rams': 'LA', 'dolphins': 'MIA', 'vikings': 'MIN', 'patriots': 'NE', 'saints': 'NO',  'giants': 'NYG', 'jets': 'NYJ', 'raiders': 'OAK', 'eagles': 'PHI', 'steelers': 'PIT', '49ers': 'SF', 'seahawks': 'SEA', 'buccaneers': 'TB', 'titans': 'TEN', 'redskins': 'WAS'};

$('img').click(function() {
  $('img').removeClass('active')
  $(this).addClass('active')
  let team =  $(this).attr('data-team');
  $('.text').text('loading . . .');
  console.log(team, teams[team]);
  let url =  `http://nflarrest.com/api/v1/team/arrests/${teams[team]}`;

  makeApiCall(url);
  //return $('button').click(makeApiCall(url));
  //return $('button').click(alert(url));
});

  function youTubeClick() {
    $('.record').click(function() {

      let name = $(this).find('.player').attr('data-name')
      let category = $(this).find('.category').attr('data-category')
      $('.video').remove();
      $(this).append("<div class='video'></div>")
      findPlayer(name, category);
  })};




















//$('.btn').click(function() {

  //$('.text').text('loading . . .');

//let url =  "http://nflarrest.com/api/v1/crime"

  //makeApiCall(url)



//});
