'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/testtypes              ->  index
 * POST    /api/testtypes              ->  create
 * GET     /api/testtypes/:id          ->  show
 * PUT     /api/testtypes/:id          ->  update
 * DELETE  /api/testtypes/:id          ->  destroy
 */
(function(){

class AddtesttypeComponent{
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;
    this.$scope=$scope;

    this.testtypes=[];//Read from DB onInit
    this.create=true;//toggle for Add/Update to DB
    this.typeId;//for Updating

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('testtype');
    });
  }
  $onInit(){
    this.$http.get('/api/testtypes')
    .then(response=>{
      this.testtypes=response.data;
      this.socket.syncUpdates('testtype', this.testtypes);
    })
  }
  Create(form){
    this.submitted=true;
    if(form.$valid){

      this.$http.post('/api/testtypes',{
        Ttype:this.InputTesttype
      })
      .then(response=>{
        this.InputTesttype='';//Empty the form
        this.submitted=false;
      });

    }
  }

  loadForUpdate(type){
    this.InputTesttype=type.Ttype;
    this.create=false;
    this.typeId=type._id;
  }

  Update(form){
    this.submitted=true;
    if(form.$valid){

      this.$http.put('/api/testtypes/'+this.typeId,{
        Ttype:this.InputTesttype
      })
      .then(response=>{
        this.InputTesttype='';//Empty the form
        this.submitted=false;
        this.create=true;//Set Page to Default
      });

    }

  }

  Delete(type){
    var x=confirm('Are you Sure you want to delete this Test Type ?');
    if(x){
      this.$http.delete('/api/testtypes/'+type._id);
    }
  }



}

angular.module('sscTestSeriesApp')
  .component('addtesttype', {
    templateUrl: 'app/addtesttype/addtesttype.html',
    controller: AddtesttypeComponent,
    controllerAs: 'addtesttypeCtrl'
  });

})();
