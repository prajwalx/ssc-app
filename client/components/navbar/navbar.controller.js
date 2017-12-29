'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'link': '/'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth,$rootScope,$http) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    this.$rootScope=$rootScope;
    this.$rootScope.hideNav=false;//Hide NavBar While On Test
    this.$http=$http;
  }

  isActive(route) {
    return route === this.$location.path();
  }

  getTest(){
    var tid=sessionStorage.getItem('tid');
    if(tid&&tid!==''){
      this.$http.get('/api/tests/'+tid)
        .then(res=>{
        this.test=res.data;
        });
    }
  }

}

angular.module('sscTestSeriesApp')
  .controller('NavbarController', NavbarController);
