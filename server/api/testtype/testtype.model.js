'use strict';

import mongoose from 'mongoose';

var TesttypeSchema = new mongoose.Schema({
  Ttype:String,
  Maxmarks:Number,
  NoOfQu:Number,
  Duration:Number,
  PositiveMark:Number,
  NegativeMark:Number,
  Qtypes:String
});

export default mongoose.model('Testtype', TesttypeSchema);
