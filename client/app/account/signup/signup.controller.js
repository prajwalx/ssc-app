'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $location) {
    this.Auth = Auth;
    this.$location = $location;
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
          if(sessionStorage.getItem('pid')==='')
          this.$location.path('/');
          else
          this.$location.path('/payment');
          //this.paynow();
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



}

angular.module('sscTestSeriesApp')
  .controller('SignupController', SignupController);
