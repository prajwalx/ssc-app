'use strict';

(function(){

class EditpackComponent {
  constructor($http,socket,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.socket=socket;
    this.$scope=$scope;

    this.packs=[];
    this.mytests=[];
    this.alltests=[];
    this.testStr;

    $scope.$on('$destroy',function() {
      socket.unsyncUpdates('pack');
    });
  }

  $onInit(){
    this.$http.get('/api/packs')
    .then(response=>{
      this.packs=response.data;
      this.socket.syncUpdates('pack',this.packs)

      //Get Tests of Each Pack From JSON Sting format
      for(var i in this.packs){
        this.GetAndSetTestID(i);
      }
    });

    this.$http.get('/api/tests')
      .then(response=>{
        this.alltestswithType=response.data;
        // get Test Type Details for Each test and set as ObjTestType of tests[i]
        for(var i in this.alltestswithType){
          this.GetAndSetTypeByID(i);
        }
      });
  }

  GetAndSetTestID(i){
    this.packs[i].TestIDarray=JSON.parse(this.packs[i].TestIDs);
  }
  GetAndSetTypeByID(i){
    this.$http.get('/api/testtypes/'+this.alltestswithType[i].testType)//Get TestType of tests[i]
        .then(response=>{
          console.log(response.data);
          this.alltestswithType[i].ObjTestType=response.data;//create new field in tests[i] to store its type

          //Question Types of this testType are a JSON string of array:'[LR,GK,MA]'
          //this.alltests[i].ObjTestType.Qtypes=JSON.parse(this.alltests[i].ObjTestType.Qtypes);
        });
  }

  loadForEdit(pack){
    this.packId=pack._id;
    this.PackName=pack.PackName;
    this.Price=pack.Price;
    this.ProductInfo=pack.ProductInfo;

    this.mytests=[];
    this.alltests=[];

    this.alltests=this.alltestswithType.slice();//Copy

      for(var i in pack.TestIDarray){//Loop TestIDs of this Pack
        for(var j in this.alltests){//Loop all tests
          if(this.alltests[j]._id===pack.TestIDarray[i]){//if id of test matches id of pack
            this.mytests.push(this.alltests[j]);//push test to my test
            this.alltests.splice(j,1);//Delete test from all tests
            break;//exit loop-2
          }
        }//end-for-loop2
      }//end-for-loop1
  }

  Delete(pack){
    var x=confirm('Are you sure you want to delete '+pack.PackName+' permanently ?');

    if(x){
      var y=confirm('Are you sure you want to delete '+pack.PackName+' permanently ?/n This action is irreversible.');
      if(y)
      this.$http.delete('/api/packs/'+pack._id);
    }
  }

  /*
  Toggle test between alltests and mytests
  */
  toggleT(x){
    if(this.alltests.indexOf(x)!==-1){
      this.mytests.push(x);//add to mytests
      this.alltests.splice(this.alltests.indexOf(x),1);//pop from total alltests
    }
    else{
      this.alltests.push(x);//add to all questypes
      this.mytests.splice(this.mytests.indexOf(x),1);//pop from mytests
    }
  }

  Update(form){
    if(form.$valid&&this.mytests.length!==0){
      this.PrepareTests();
      this.$http.put('/api/packs/'+this.packId,{
        PackName:this.PackName,
        Price:this.Price,
        ProductInfo:this.ProductInfo,
        NoOfTest:this.mytests.length,
        TestIDs:this.testStr,//JSON array Stringed
      })
      .then(response=>{
        alert(this.PackName+' Pack Updated');
        location.href='/editpack';
      });
    }
  }

  /*
  PrepareTests ID array JSON
  */
  PrepareTests(){
    var arr=[];
    for(var i in this.mytests){
      arr.push(this.mytests[i]._id);
    }//end-for-loop1
    this.testStr=angular.toJson(arr);

  }

}

angular.module('sscTestSeriesApp')
  .component('editpack', {
    templateUrl: 'app/editpack/editpack.html',
    controller: EditpackComponent,
    controllerAs: 'editpackCtrl'
  });

})();
