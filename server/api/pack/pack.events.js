/**
 * Pack model events
 */

'use strict';

import {EventEmitter} from 'events';
import Pack from './pack.model';
var PackEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PackEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Pack.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PackEvents.emit(event + ':' + doc._id, doc);
    PackEvents.emit(event, doc);
  }
}

export default PackEvents;
