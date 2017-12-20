'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $location,$http) {
    this.Auth = Auth;
    this.$location = $location;
    this.$http=$http;
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          mobile:this.user.mobile,
          password: this.user.password
        })
        .then(() => {
          // Account created, redirect to home
          //TODO:if paid test goto Payments
          //    else go to Free user Dashboard
          //this.$location.path('/');
          this.paynow();
        })
        .catch(err => {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }

  //Payments are here
  paynow(){

    //hashSequence for Payment Request
    // this.hseq = ( this.key + '|' + this.tid + '|' +this.amount + '|' +this.productinfo + '|'
    // + this.firstname + '|' + this.email + '|' + this.udf1 + '|'+this.udf2+'|'+this.udf3+'|'
    // +this.udf4+'|'+this.udf5+'||||||');
    console.log(this.user);
    this.$http.post('/api/hash/',{
      name: this.user.name,
      email: this.user.email,
      phone:this.user.mobile
      //packId:this.packId

    })
    .then(response =>{

          console.log('Hash Called Successfully');

          //store hash from server response
          //this.hash=(response.data);

          console.log(response.data);

          //call bolt.launch payment gateway
          bolt.launch({
             key: response.data.key,
             txnid: response.data.tid,
             hash: response.data.hash,
             amount: response.data.amount,
             udf1:response.data.udf1,
             udf2:response.data.udf2,
             firstname: response.data.firstname,
             email: response.data.email,
             phone: response.data.phone,
             productinfo: response.data.productinfo,
             surl : response.data.surl,
             furl: response.data.furl

             },{ responseHandler: function(response){
             // your payment response Code goes here
             console.log('Response Successfully');
             console.log(response);

             //If transaction Success or Failed
             if(response.response.txnStatus!=='CANCEL'&&response.response.hash){

               this.responseHash=response.response.hash;

               //pass response from payumoney to verify() function:
               var res=response.response;
               console.log(res);
               //Golden Lines below to call Angular function from JS to verify Success
               //angular.element('#myidforJS').scope().paymentCtrl.verify(res);//GOing to Controller
               //angular.element('#myidforJS').scope().$apply();
             }

             //Else-If Overlay Closed By Customer
             else
             console.log('No Hash Yet');

             },
             catchException: function(response){
             // the code you use to handle the integration errors goes here
             console.log('errors Response');
             console.log(response);
             }
         });//End -bolt-launch
    });//end server Request

  }//end pay now function

}

angular.module('sscTestSeriesApp')
  .controller('SignupController', SignupController);
