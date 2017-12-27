'use strict';

class LoginController {
  constructor(Auth, $location) {
    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$location = $location;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Logged in, redirect to home
          // this.$location.path('/');
          if(sessionStorage.getItem('pid')===''||!sessionStorage.getItem('pid'))
          this.$location.path('/');
          else
          this.$location.path('/payment');
        })
        .catch(err => {
          this.errors.other = err.message;
        });
    }
  }
}

angular.module('sscTestSeriesApp')
  .controller('LoginController', LoginController);
