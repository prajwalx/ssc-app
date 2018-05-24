/**
 * Broadcast updates to client when the model changes
 */

'use strict';

import QuestionEvents from './question.events';

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('question:' + event, socket);

    QuestionEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }

  //my upload event
  socket.on('imageUpload',function(info){
    console.log('socket connected');
    //{image} is transfered in websockets in base64 format from client to server
    var base64Data=info.buffer;

    console.log(info.format);

    if(base64Data){//if data is not null
      //Extract base64data
      base64Data=info.buffer.substring(info.buffer.search(','));
      //Write data as file in images folder as {name}.{format}
      require("fs").writeFile(__dirname +"/images/"+info.name+"."+info.format,
        base64Data,{ encoding:'base64',flag:'wx+'}, function(err) {
          //wx+ => fails if file exists
          if(err){
            console.log(err);
            //return failure
            socket.emit('UploadSuccess',err.code+' Probably a file with same name already Eexists!'+
            '  If the file content is same as / '+info.name+' then No need for upload ,else rename the file and upload ');
            }

            else{//no err
              //return success
            socket.emit('UploadSuccess','true');
            }
          });
    }
    else//data is null
    socket.emit('UploadSuccess','base64Data is null ');
  });
  //my upload event ends
}


function createListener(event, socket) {
  return function(doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    QuestionEvents.removeListener(event, listener);
  };
}
