'use strict';

import mongoose from 'mongoose';

var TestSchema = new mongoose.Schema({
  testTitle:String,
  testType:String,
  questionIDs:String//JSON string of an array of questionIDs
});

export default mongoose.model('Test', TestSchema);
