'use strict';

(function(){
  /**
   * Using Rails-like standard naming convention for endpoints.
   * GET     /api/questypes              ->  index
   * POST    /api/questypes              ->  create
   * GET     /api/questypes/:id          ->  show
   * PUT     /api/questypes/:id          ->  update
   * DELETE  /api/questypes/:id          ->  destroy
   */
class AddquestypeComponent {
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;
    this.$scope=$scope;

    this.questypes=[];//Read from DB onInit
    this.create=true;//toggle for Add/Update to DB
    this.typeId;//for Updating

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('questype');
    });
  }
  $onInit(){
    this.$http.get('/api/questypes')
    .then(response=>{
      this.questypes=response.data;
      this.socket.syncUpdates('questype', this.questypes);
    })
  }
  Create(form){
    this.submitted=true;
    if(form.$valid){

      this.$http.post('/api/questypes',{
        Qtype:this.Inputquestype
      })
      .then(response=>{
        this.Inputquestype='';//Empty the form
        this.submitted=false;
      });

    }
  }

  loadForUpdate(type){
    this.Inputquestype=type.Qtype;
    this.create=false;
    this.typeId=type._id;
  }

  Update(form){
    this.submitted=true;
    if(form.$valid){

      this.$http.put('/api/questypes/'+this.typeId,{
        Qtype:this.Inputquestype
      })
      .then(response=>{
        this.Inputquestype='';//Empty the form
        this.submitted=false;
        this.create=true;//Set Page to Default
      });

    }

  }

  Delete(type){
    var x=confirm('Are you Sure you want to delete this Question Type ?');
    if(x){
      this.$http.delete('/api/questypes/'+type._id);
    }
  }



}

angular.module('sscTestSeriesApp')
  .component('addquestype', {
    templateUrl: 'app/addquestype/addquestype.html',
    controller: AddquestypeComponent,
    controllerAs: 'addquestypeCtrl'
  });

})();
