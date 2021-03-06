'use strict';

import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
  question:String,
  questype:String,
  quesImg:{
    type:String,
    default:''},//URL Amazon S3 CDN
  a:String,//1
  b:String,//2
  c:String,//3
  d:String,//4
  ans:Number,//1,2,3,4
  aURL:{
    type:String,
    default:''},//URL Amazon S3 CDN
  bURL:{
    type:String,
    default:''},//URL Amazon S3 CDN
  cURL:{
    type:String,
    default:''},//URL Amazon S3 CDN
  dURL:{
    type:String,
    default:''},//URL Amazon S3 CDN
  solutionImg:{
    type:String,
    default:''},//URL Amazon S3 CDN    
  solution:String
});

export default mongoose.model('Question', QuestionSchema);
