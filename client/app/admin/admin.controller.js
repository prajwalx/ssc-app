'use strict';

(function() {

  class AdminController {
    constructor(User) {
      // Use the User $resource to fetch all users
      this.users = User.query();
    }

    delete(user) {
      var x = confirm('Are you sure , You want to delete');
      if(x){
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }
    }
  }

  angular.module('sscTestSeriesApp.admin')
    .controller('AdminController', AdminController);
})();
