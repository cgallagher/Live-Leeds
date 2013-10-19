var FeedParser = require('feedparser');
var request = require('request');

function updateFeeds(){
  request('http://www.soccerstand.com/rss/soccer')
    .pipe(new FeedParser())
    .on('error', function(error) {
      console.log("error");
    })
    .on('meta', function (meta) {
      console.log(meta);
      done();
    })
    .on('readable', function () {
      var stream = this, item;
      while (item = stream.read()) {
        if (premiershipGameCheck(item.title)){
          console.log(item.title);
        } 
      }
    });
}

function premiershipGameCheck(score){
  var matched = false
  var teams = ["Arsenal", "Chelsea", "Fulham", "Liverpool", "Leeds", "Manchester", "Blackburn", "Tottenham"];
  for (i=0; i < teams.length; i++){
    if (score.match(teams[i])){
      matched = true;
      break;
    }
  }
  
  return matched;
}

function done(){
  setTimeout( updateFeeds, 5000 );
}

updateFeeds();