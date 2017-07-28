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
            <div class="player"><span>Player: </span>${data[i].Name}</div>
            <div class="description"><span>Description: </span>${data[i].Description}</div>
            <div class="category"><span>Category: </span>${data[i]["Category"]}</div>


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
  let team =  $(this).attr('data-team');
  $('.text').text('loading . . .');
  console.log(team, teams[team]);
  let url =  `http://nflarrest.com/api/v1/team/arrests/${teams[team]}`;

  makeApiCall(url);
  //return $('button').click(makeApiCall(url));
  //return $('button').click(alert(url));
});

  function youTubeClick() {$('.record').click(function() {
    console.log(this);
  }
);}

//$('button').click(function() {
  //console.log(this)
  //let year =  $(this).attr('data-year');
  //let month =  $(this).attr('data-month');
  //$('.text').text('loading . . .');
  //let url =  `http://nflarrest.com/api/v1/team/timeline/${teams[team]}`;

  //makeApiCall(url);

//});















//$('.btn').click(function() {

  //$('.text').text('loading . . .');

//let url =  "http://nflarrest.com/api/v1/crime"

  //makeApiCall(url)



//});
