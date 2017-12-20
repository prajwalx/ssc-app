'use strict';

//Tutorial for pwd reset:http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
import User from '../user/user.model';
var express = require('express');

var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

var router = express.Router();

var msg={};//For Sending Response to client

/*
Forgot Password Route
token generation and mailing to client email
*/
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      console.log(req.body.email);
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          //return res.redirect('/forgot');
          msg={
            class:false,
            msg:'No account with that email address exists.'};
          return res.send(msg);
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      // var smtpTransport = nodemailer.createTransport('SMTP', {
      var smtpTransport = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: 'prajwalbhati@hotmail.com',
          pass: 'prajwal28'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'prajwalbhati@hotmail.com',
        subject: 'Bhati Enterprises Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        msg={class:true,msg:'An e-mail has been sent to ' + user.email + ' with further instructions.'};
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    //res.redirect('/forgot');
    res.send(msg);
  });
});

/*
When client opens link from mail serve the reset page only if
token is still valid(1hour)
else redirect to forgot
(actual logic in client reset controller)
*/
router.get('/reset/:token', function(req, res) {
  console.log(req.params.token);//:65f1c94764cf06583f281134e2ddae751e32e242 // removing colon
  User.findOne({ resetPasswordToken: req.params.token.substr(1), resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      //req.flash('error', 'Password reset token is invalid or has expired.');
      msg={class:false,msg:'Password reset token is invalid or has expired.'};
      //return res.redirect('/forgot');
       return res.send(msg);
    }
    return res.send({class:true});
    // res.render('reset', {
    //   user: req.user
    // });
  });
});

/*Save Changed Password Route:
Save changed pwd from post request from reset controller(client)
only if token is valid
*/

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          //req.flash('error', 'Password reset token is invalid or has expired.');
          msg={class:false,msg:'Password reset token is invalid or has expired.'};
          //return res.redirect('back');
          return res.send(msg);

        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);//by@prajwalbhati
          // req.logIn(user, function(err) {
          //   done(err, user);
          // });
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: 'prajwalbhati@hotmail.com',
          pass: 'prajwal28'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'prajwalbhati@hotmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
              'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        //req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        msg={class:true,msg: 'Success! Your password has been changed.'};
        done(err);
      });
    }
  ], function(err) {
    res.send(msg);
    //res.redirect('/');
  });
});


module.exports = router;
