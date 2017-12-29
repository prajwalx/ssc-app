'use strict';

//Tutorial for pwd reset:http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
import User from '../user/user.model';
var express = require('express');

//var async = require('async');
//var nodemailer = require('nodemailer');
//var crypto = require('crypto');

var router = express.Router();

//var msg={};//For Sending Response to client

router.post('/',function(req,res) {
  console.log('In myuser');
  var pack=JSON.parse(req.body.pack);
  var uid=req.body.id;
   User.findById(uid).exec()
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      // res.json(user.profile);
      //Update DB information On paymentSuccess from paymentCtrl request
      var arr=[];
      if(user.packIDs!==''){
        arr=JSON.parse(user.packIDs);
      }
      arr.push(pack._id);
      user.packIDs=JSON.stringify(arr);
      user.payment=user.payment+pack.Price;
      user.save();
      return res.status(200).end();
    })
    .catch(err => next(err));
});

//isPurchased-----------------
router.post('/GetUser',function(req,res){
var pid=req.body.pid;
var uid=req.body.uid;
console.log('In myuser: '+req.body.pid);
User.findById(uid).exec()
    .then(user=>{
      if(!user){
        console.log('!user Not found');
          return res.status(404).end();
      }
      var packIDs=[];
      if(user.packIDs!==""){
        packIDs=JSON.parse(user.packIDs);
      }
      for(var i in packIDs){
        if(packIDs[i]===pid){
            return res.send('2');//2 for Success,Yes Purchased
            break;
        }
      }
      return res.send('0');//Not Found
    })
      .catch(err => next(err));
});

module.exports = router;
