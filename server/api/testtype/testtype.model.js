'use strict';

import mongoose from 'mongoose';

var TesttypeSchema = new mongoose.Schema({
  Ttype:String
});

export default mongoose.model('Testtype', TesttypeSchema);
