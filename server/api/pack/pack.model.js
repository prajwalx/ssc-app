'use strict';

import mongoose from 'mongoose';

var PackSchema = new mongoose.Schema({
  PackName:String,
  Price:Number,
  ProductInfo:String,
  NoOfTest:Number,
  TestIDs:String,//JSON array Stringed
});

export default mongoose.model('Pack', PackSchema);
