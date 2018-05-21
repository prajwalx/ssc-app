"use strict"

export function register(socket){
  socket.on('message',function(msg){
    console.log(msg);
  });
}
