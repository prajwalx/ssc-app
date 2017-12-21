/**
 * Questype model events
 */

'use strict';

import {EventEmitter} from 'events';
import Questype from './questype.model';
var QuestypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
QuestypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Questype.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    QuestypeEvents.emit(event + ':' + doc._id, doc);
    QuestypeEvents.emit(event, doc);
  }
}

export default QuestypeEvents;
