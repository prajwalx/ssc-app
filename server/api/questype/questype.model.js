'use strict';

import mongoose from 'mongoose';

var QuestypeSchema = new mongoose.Schema({
  Qtype:String
});

export default mongoose.model('Questype', QuestypeSchema);
