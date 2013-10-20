var FeedParser = require('feedparser');
var request = require('request');
var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);


var jade = require('jade');


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });
app.configure(function() {
	app.use(express.static(__dirname + '/public'));
});
app.get('/', function(req, res){
  res.render('home.jade');
});

server.listen(3000);

io.sockets.on('connection', function (socket) {
  setInterval(function(){
    updateFeeds(function(data){
      socket.broadcast.emit('score', data);
    });
  }, 10000);
  
  
});

function updateFeeds(cb){
  request('http://www.soccerstand.com/rss/soccer')
    .pipe(new FeedParser())
    .on('error', function(error) {
      console.log("error");
    })
    .on('meta', function (meta) {
      //console.log(meta);
      //cb();
    })
    .on('readable', function () {
      var stream = this, item;
      var scores = []
      while (item = stream.read()) {
        if (premiershipGameCheck(item.title)){
          cb(item.title);
        } 
      }
      
    });
}
 
function premiershipGameCheck(score){
  var matched = false;
  // var teams = ["Arsenal", "Chelsea", "Fulham", "Liverpool", "Leeds", "Manchester", "Blackburn", "Tottenham", "Coventry"];
  var teams = ["Leeds"];
  for (i=0; i < teams.length; i++){
    if (score.match(teams[i])){
      matched = true;
      break;
    }
  }
  
  return matched;
}
