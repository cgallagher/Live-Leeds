var socket = io.connect();

$(document).ready(function(){
  socket.on('score', function(data) {
     //addMessage(data['messa?ge'], data['username']);
     console.log(data);
     $("#scores").text(data);
  });  
})
