'use strict';

(function(){

class PaymentComponent {
  user={};
  constructor($http,Auth,$scope) {
    this.message = 'Hello';
    this.$http=$http;
    this.$scope=$scope;
    this.Auth=Auth;

    this.pack;
    this.testType;

  }

  $onInit(){
    this.user=this.Auth.getCurrentUser();
    this.$http.get('/api/packs/'+sessionStorage.getItem('pid'))
      .then(response=>{
        this.pack=response.data;
        this.GetPriceAndDuration(JSON.parse(this.pack.TestIDs));
      });
  }

  GetPriceAndDuration(tids){
    this.$http.get('/api/tests/'+tids[0])
      .then(response=>{
        this.$http.get('/api/testtypes/'+response.data.testType)
          .then(res=>{
            this.testType=res.data;
          });
      });
  }

  Validate(form){
    this.submitted=true;
    if(form.$valid){
      this.paynow();
    }
  }


  paynow(){
    //hashSequence for Payment Request
    // this.hseq = ( this.key + '|' + this.tid + '|' +this.amount + '|' +this.productinfo + '|'
    // + this.firstname + '|' + this.email + '|' + this.udf1 + '|'+this.udf2+'|'+this.udf3+'|'
    // +this.udf4+'|'+this.udf5+'||||||');
    console.log(this.user);
    this.$http.post('/api/hash/',{
      name: this.user.name,
      email: this.user.email,
      phone:this.user.mobile,
      pack:angular.toJson(this.pack)
    })
      .then(response =>{
          console.log('Hash Called Successfully');
          console.log(response.data);

          //call bolt.launch payment gateway
          bolt.launch({
             key: response.data.key,
             txnid: response.data.tid,
             hash: response.data.hash,
             amount: response.data.amount,
             udf1:response.data.udf1,
             udf2:response.data.udf2,
             firstname: response.data.firstname,
             email: response.data.email,
             phone: response.data.phone,
             productinfo: response.data.productinfo,
             surl : response.data.surl,
             furl: response.data.furl

             },{ responseHandler: function(response){
             // your payment response Code goes here
             // "SUCCESS" / "FAILED" / "CANCEL"

             console.log('Response From payumoney');
             console.log(response);

             //If transaction Success or Failed but NOT cancel by user
             if(response.response.txnStatus!=='CANCEL'&&response.response.hash){

               this.responseHash=response.response.hash;

               //pass response from payumoney to verify() function:
               var res=response.response;
               console.log(res);
               //Golden Lines below to call Angular function from JS to verify ResponseHash
               angular.element('#myidforJS').scope().paymentCtrl.verify(res);//GOing to Controller
               angular.element('#myidforJS').scope().$apply();
             }

             //Else-If Overlay Closed By Customer
             else{
            console.log('No Hash From payumoney Yet, txnStatus:CANCEL');

             }


             },
             catchException: function(response){
             // the code you use to handle the integration errors goes here
             console.log('errors Response');
             console.log(response);
             }
         });//End -bolt-launch
    });//end server Request

  }//end pay now function

  verify(res){

    console.log('response Verify Hash function');
    //Hash Sequence for Payment Response
    var mystr=( '|'+res.status + '||||||' + res.udf5 + '|' +res.udf4 + '|' +res.udf3 + '|'
    + res.udf2 + '|' + res.udf1 + '|' + res.email + '|'+res.firstname+'|'+res.productinfo+'|'
    +res.amount+'|'+res.txnid+'|'+res.key);

    console.log(mystr);

    //passing obj of hashSequence,hash from payumoney,status to server
    var obj={
      postHash:res.hash,
      status: res.status,
      mystr: mystr
    };

    //JSON object
    obj=angular.toJson(obj);
    console.log(obj);

    // Send obj to server response will be 1 if hashSequence with salt matches exactly with postHash otherwise: 0
    this.$http.get('/api/hash/verify/:'+obj).then(response =>{
      console.log(response.data);
      if(response.data==='1'&&res.txnStatus==='SUCCESS'){

      this.paymentSuccess();
      }
      else
      alert(res.txnStatus);
    });

  }//End-Verify

  paymentSuccess(){
    this.loading='fa fa-spinner loader';
    //save to DB
    this.$http.post('/api/myuser/',{
      id:this.user._id,
      pack:angular.toJson(this.pack)
    })
      .then(response=>{
        this.loading="";
        location.href='/';// TODO: Redirect to DashBoard
      });

  }

}//End-class

angular.module('sscTestSeriesApp')
  .component('payment', {
    templateUrl: 'app/payment/payment.html',
    controller: PaymentComponent,
    controllerAs: 'paymentCtrl'
  });

})();
