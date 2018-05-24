/* global io */
'use strict';

angular.module('sscTestSeriesApp')
  .factory('socket', function(socketFactory) {
    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket
    });

    return {
      socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates(modelName, array, cb) {
        cb = cb || angular.noop;
        //angular.noop is an empty function that can be used as a placeholder when you need to pass some function as a param.

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function(item) {
          var oldItem = _.find(array, {
            _id: item._id
          });
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function(item) {
          var event = 'deleted';
          _.remove(array, {
            _id: item._id
          });
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates(modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      },

      unsyncUpdatesQuestionUpload(){
        socket.removeAllListeners('UploadSuccess');
      },

      sendMsg(msg){
        socket.emit('message', {
        message: msg
      });
     },

     UploadImageToServer(imgdata,format,name,count){
       //count is array ,becoz it's passed by reference,thus updates reflect in addquestionCtrl(controller)
       //this is quick fix, // TODO: pass by refernce : pass args as an object ,
       //but everything works good now also :)

       //Upload File
       socket.emit('imageUpload',{
          image: true,
           buffer: imgdata ,
           format:format,
           name:name
         });

         //listeners for reply from server
        socket.on('UploadSuccess',function(status){
          socket.removeAllListeners('UploadSuccess');//to avoid double msgs

          if(status==='true'){
          alert('Successfully Uploaded !!');
          count[0]++;
          }
          else{
            if(status.substring(0,6)==='EEXIST')
              count[0]++;//IF same file is already uploaded then no need for re-uploading
          alert(status);
          }

        });
     }
     //UploadImageToServer My Function Ends

    };
  });
