/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/packs', require('./api/pack'));
  app.use('/api/tests', require('./api/test'));
  app.use('/api/testtypes', require('./api/testtype'));
  app.use('/api/questypes', require('./api/questype'));
  app.use('/api/questions', require('./api/question'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/forgotP', require('./api/forgotP'));
  app.use('/api/myuser', require('./api/myuser'));
  app.use('/api/hash', require('./api/hash'));
  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/app.html'));
    });
}
