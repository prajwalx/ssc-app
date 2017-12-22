/**
 * Testtype model events
 */

'use strict';

import {EventEmitter} from 'events';
import Testtype from './testtype.model';
var TesttypeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
TesttypeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Testtype.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    TesttypeEvents.emit(event + ':' + doc._id, doc);
    TesttypeEvents.emit(event, doc);
  }
}

export default TesttypeEvents;
