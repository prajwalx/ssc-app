'use strict';

class ResetController {
  user = {};
  errors = {};
  submitted = false;
  disable = false;
  //this.token;
  constructor(token,$http,$scope) {
    this.token=token;
    this.$http=$http;
    //alert(this.token);
    this.VerifyToken();
    this.res;



  }

  $onInit(){
    console.log('OnInit');

    }

    VerifyToken(){
      console.log(this.token);
      this.$http.get('api/forgotP/reset/:'+this.token)
      .then(response=>{

        console.log(response.data.class);
        if(response.data.class===false){
          sessionStorage.setItem('msg',JSON.stringify(response.data));
          location.href="/forgot";
        }

        else
        //alert('Valid');
        //alert(JSON.parse(response.data.user));
        console.log('VALID in reset controller');
      });
    }

    changePassword(form){
      this.submitted = true;
      this.disable   = true;
      this.class     = "fa fa-spinner loader";
      if (form.$valid)
      {
        //alert('NOW U CHANGE');'/api/forgotP/forgot',
        this.$http.post('/api/forgotP/reset/'+this.token, {
          password:this.user.newPassword
        }).then(response=>{
          this.class="";
          this.res=response.data;
          if(!response.data.class){ //Failure
            this.disable=false;
          }
          //console.log(response);
        //
        //
        // });
        // this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        //   .then(() => {
        //     this.message = 'Password successfully changed.';
        //   })
        //   .catch(() => {
        //     form.password.$setValidity('mongoose', false);
        //     this.errors.other = 'Incorrect password';
        //     this.message = '';
        //   });
      });
          }
      else{
        this.disable = false;
        this.class="";

      }
    }

}
// angular.module('bhatiEnterprisesApp')
//   .component('forgot', {
//     templateUrl: 'app/forgot/forgot.html',
//     controller: ForgotComponent,
//     controllerAs: 'forgotCtrl'
//   });
//
// })();
angular.module('sscTestSeriesApp')
  .controller('ResetController', ResetController);
