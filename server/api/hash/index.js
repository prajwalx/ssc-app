'use strict';

//import User from '../user/user.model';Import pack form....testpacks pack will have info about price,tests.
var express = require('express');

var sha512 = require('js-sha512');


var router = express.Router();


router.post('/',function(req,res) {

  //hashSequence for Payment Request
  // this.hseq = ( this.key + '|' + this.tid + '|' +this.amount + '|' +this.productinfo + '|'
  // + this.firstname + '|' + this.email + '|' + this.udf1 + '|'+this.udf2+'|'+this.udf3+'|'
  // +this.udf4+'|'+this.udf5+'||||||');
  console.log(req.body);
  var pack=JSON.parse(req.body.pack);
  var udf='';
  var key='xcBWWs3T';
  var salt='HYfr24pBbF';
  var tid="BE"+(new Date().toUTCString());
  var amount=pack.Price;//to get from packid
  var name=req.body.name;
  var email=req.body.email;
  var phone=req.body.phone;
  var productinfo=pack.ProductInfo;//to get from packid
  var prehsh= key + '|' + tid + '|' + amount + '|' + productinfo + '|' +name + '|'
              + email  +'|||||'+'||||||'+salt;

  console.log(prehsh);

  //var gh=sha512('gtKFFx|123|20|LED Spacer|Prajwal|prajwalbhati@hotmail.com|||||||||||eCwWELxi');
  var gh=sha512(prehsh);
  //JSON.stringify(gh);
  console.log(gh);
  var resp={key:key,
            tid:tid,
            hash:gh,
            amount:amount,
            udf1:'',
            udf2:'',
            firstname:name,
            email:email,
            phone:phone,
            productinfo:productinfo,
            surl:req.headers.host,
            furl:req.headers.host

      };
  res.json(resp);


});
//TODO;modify it after payu issue settled
router.get('/verify/:obj',function(req,res){
  // console.log(req.params.obj);
  var s='1';
  var f='0';
  var data=req.params.obj.substr(1);
  data=JSON.parse(data);
  var postStr='HYfr24pBbF'+data.mystr;
  var phash=sha512(postStr);
  console.log(data.postHash);
  console.log(phash);
  if(phash.localeCompare(data.postHash)===0)
  res.send(s);//Success==1
  else
  res.send(f);//Failure ==0

});

module.exports = router;
