'use strict';

(function(){

class AddquestionComponent {
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;



  }

}//class ends

angular.module('sscTestSeriesApp')
  .component('addquestion', {
    templateUrl: 'app/addquestion/addquestion.html',
    controller: AddquestionComponent,
    controllerAs: 'addquestionCtrl'
  });

})();
