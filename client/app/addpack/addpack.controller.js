'use strict';

(function(){

class AddpackComponent {
  constructor($http,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;

    this.alltests=[];
    this.mytests=[];
    this.testStr;
  }

  $onInit(){
    //Get all tests
    this.$http.get('/api/tests')
      .then(response=>{
        this.alltests=response.data;
        // get Test Type Details for Each test and set as ObjTestType of tests[i]
        for(var i in this.alltests){
          this.GetAndSetTypeByID(i);
        }

      });
  }//end-OnInit

  GetAndSetTypeByID(i){
    this.$http.get('/api/testtypes/'+this.alltests[i].testType)//Get TestType of tests[i]
        .then(response=>{
          this.alltests[i].ObjTestType=response.data;//create new field in tests[i] to store its type

          //Question Types of this testType are a JSON string of array:'[LR,GK,MA]'
          this.alltests[i].ObjTestType.Qtypes=JSON.parse(this.alltests[i].ObjTestType.Qtypes);
        });
  }

  /*
  Create Pack
  */
  Create(form){
    this.submitted=true;
    if(form.$valid&&this.mytests.length!==0){
      this.PrepareTests();
      this.$http.post('/api/packs',{
        PackName:this.PackName,
        Price:this.Price,
        ProductInfo:this.ProductInfo,
        NoOfTest:this.mytests.length,
        TestIDs:this.testStr,//JSON array Stringed
      })
      .then(response=>{
        alert(this.PackName+' Pack Created');
        location.href='/addpack';
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

}//end-class

angular.module('sscTestSeriesApp')
  .component('addpack', {
    templateUrl: 'app/addpack/addpack.html',
    controller: AddpackComponent,
    controllerAs: 'addpackCtrl'
  });

})();
