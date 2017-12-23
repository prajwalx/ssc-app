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
    this.questypes=[];//Read from DB onInit
    this.selectedQuesTypes=[];//For Selecting Question types from all questypes
    this.create=true;//toggle for Add/Update to DB
    this.typeId;//for Updating
    this.allQuestypesOriginalCopy=[];

    //Socket Not Showing Synced Qtypes JSON String to Array
    // $scope.$on('$destroy', function() {
    //   socket.unsyncUpdates('testtype');
    // });
  }
  $onInit(){
    this.$http.get('/api/testtypes')
    .then(response=>{
      var arr=response.data;
      //JSON Parse qTypes array then store to response to testtypes for ng-repeat,table below
      var i;
      for(i=0;i<arr.length;i++){
        arr[i].Qtypes=JSON.parse(arr[i].Qtypes);
      }
      this.testtypes=arr;
      //this.socket.syncUpdates('testtype', this.testtypes);
    });

    this.$http.get('/api/questypes')
    .then(response=>{
      var typearr=response.data;
      var arr=[];
      typearr.forEach( function (arrayItem)//Extracting only Qtypes from entire Object
        {
          arr.push(arrayItem.Qtype);
      });
      this.questypes=arr;//this.questypes Now Only contains array of string of Question Types , not array of Object s
      //Basically, the slice() operation clones the array and returns the reference to the new array. Also note that:
      this.allQuestypesOriginalCopy=this.questypes.slice();
    });
  }
  Create(form){
    this.submitted=true;
    if(form.$valid&&this.selectedQuesTypes.length){
      console.log(this.selectedQuesTypes);
      this.$http.post('/api/testtypes',{
        Ttype:this.InputTesttype,
        Maxmarks:this.InputTesttypeMarks,
        NoOfQu:this.NoOfQuestion,
        Duration:this.Duration,
        PositiveMark:this.PositiveMarks,
        NegativeMark:this.NegativeMarks,
        Qtypes:angular.toJson(this.selectedQuesTypes)
      })
      .then(response=>{
        this.InputTesttype='';//Empty the form
        this.InputTesttypeMarks=null;
        this.NoOfQuestion=null;
        this.Duration=null;
        this.PositiveMarks=null;
        this.NegativeMarks=null;
        this.selectedQuesTypes=[];
        this.questypes=[];
        //Basically, the slice() operation clones the array and returns the reference to the new array. Also note that:
        this.questypes=this.allQuestypesOriginalCopy.slice();
        this.submitted=false;
        location.href='/addtesttype';//Since Socket is Working but not Syncing JSON string array in ng-repeat,We Reload The Page
      });

    }
  }

  loadForUpdate(type){
    this.InputTesttype=type.Ttype;
    this.InputTesttypeMarks=type.Maxmarks;
    this.NoOfQuestion=type.NoOfQu;
    this.Duration=type.Duration;
    this.PositiveMarks=type.PositiveMark;
    this.NegativeMarks=type.NegativeMark;

    this.selectedQuesTypes=[];
    this.questypes=[];
    //Basically, the slice() operation clones the array and returns the reference to the new array. Also note that:
    this.selectedQuesTypes=type.Qtypes.slice();
    this.questypes=this.allQuestypesOriginalCopy.slice();
    this.RemoveSelectedQfromAll(type.Qtypes.slice());
    //
    this.create=false;
    this.typeId=type._id;
  }

  Update(form){
    this.submitted=true;
    console.log(this.selectedQuesTypes);
    if(form.$valid&&this.selectedQuesTypes.length){

      this.$http.put('/api/testtypes/'+this.typeId,{
        Ttype:this.InputTesttype,
        Maxmarks:this.InputTesttypeMarks,
        NoOfQu:this.NoOfQuestion,
        Duration:this.Duration,
        PositiveMark:this.PositiveMarks,
        NegativeMark:this.NegativeMarks,
        Qtypes:angular.toJson(this.selectedQuesTypes)
      })
      .then(response=>{
        this.InputTesttype='';//Empty the form
        this.InputTesttypeMarks=null;
        this.NoOfQuestion=null;
        this.Duration=null;
        this.PositiveMarks=null;
        this.NegativeMarks=null;

        this.selectedQuesTypes=[];
        this.questypes=[];
        //Basically, the slice() operation clones the array and returns the reference to the new array. Also note that:
        this.questypes=this.allQuestypesOriginalCopy.slice();

        this.submitted=false;
        this.create=true;//Set Page to Default
        location.href='/addtesttype';
      });

    }

  }

  Delete(type){
    var x=confirm('Are you Sure you want to delete this Test Type ?');
    if(x){
      this.$http.delete('/api/testtypes/'+type._id)
      .then(response=>{
        location.href='/addtesttype';
      });

    }
  }

  /*
  toggleQ from all questypes to electedQuesTypes and vice-versa
  */
  toggleQ(x){
    if(this.questypes.indexOf(x)!==-1){
      this.selectedQuesTypes.push(x);//add to selectedQuesTypes
      this.questypes.splice(this.questypes.indexOf(x),1);//pop from total questypes
    }
    else{
      this.questypes.push(x);//add to all questypes
      this.selectedQuesTypes.splice(this.selectedQuesTypes.indexOf(x),1);//pop from selectedQuesTypes
    }
  }

  /*
  Remove selectedQuesTypes from all questypes while loadForUpdate()
  */
  RemoveSelectedQfromAll(sel){
    while(sel.length>0){
      var x=sel.pop();
      if(this.questypes.indexOf(x)!==-1)
      this.questypes.splice(this.questypes.indexOf(x),1);
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
