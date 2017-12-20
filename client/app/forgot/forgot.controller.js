'use strict';

(function(){

class ForgotComponent {

  user={};
  errors = {};
  submitted = false;

  constructor($http,$scope,socket) {
    this.message = 'Hello';
    this.$http=$http;
    this.res;


    // this.res=JSON.parse(sessionStorage.getItem('msg'));
    // console.log(this.res);
    $scope.$on('$destroy', function() {
      // socket.unsyncUpdates('thing');
      //sessionStorage.clear();//TODO:clear only msg{}
      sessionStorage.removeItem('msg');
      //this.submitted=false;
    });
  }
  $onInit(){
    this.res=JSON.parse(sessionStorage.getItem('msg'));
    if(this.res)
    this.submitted=true;
    console.log(this.res);
  }

  submit(form){


    this.class="fa fa-spinner loader";
    this.submitted = true;//ng-show for response
    this.disable=true;//disable submit btn
    if(form.$valid){
      console.log('Valid');
      this.$http.post('/api/forgotP/forgot', {
        email:this.user.email
      }).then(response=>{
        //console.log(response);
        console.log(response.data);
        this.res=response.data;
        this.class="";
        if(this.res.class===false)
        this.disable=false;

      });
    }
    else{
      console.log('invalid');
      this.class="";
      this.disable=false;

    }
  }
}

angular.module('sscTestSeriesApp')
  .component('forgot', {
    templateUrl: 'app/forgot/forgot.html',
    controller: ForgotComponent,
    controllerAs: 'forgotCtrl'
  });

})();
