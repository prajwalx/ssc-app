'use strict';

var app = require('../..');
import request from 'supertest';

var newTesttype;

describe('Testtype API:', function() {

  describe('GET /api/testtypes', function() {
    var testtypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/testtypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testtypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(testtypes).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/testtypes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/testtypes')
        .send({
          name: 'New Testtype',
          info: 'This is the brand new testtype!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newTesttype = res.body;
          done();
        });
    });

    it('should respond with the newly created testtype', function() {
      expect(newTesttype.name).to.equal('New Testtype');
      expect(newTesttype.info).to.equal('This is the brand new testtype!!!');
    });

  });

  describe('GET /api/testtypes/:id', function() {
    var testtype;

    beforeEach(function(done) {
      request(app)
        .get('/api/testtypes/' + newTesttype._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          testtype = res.body;
          done();
        });
    });

    afterEach(function() {
      testtype = {};
    });

    it('should respond with the requested testtype', function() {
      expect(testtype.name).to.equal('New Testtype');
      expect(testtype.info).to.equal('This is the brand new testtype!!!');
    });

  });

  describe('PUT /api/testtypes/:id', function() {
    var updatedTesttype;

    beforeEach(function(done) {
      request(app)
        .put('/api/testtypes/' + newTesttype._id)
        .send({
          name: 'Updated Testtype',
          info: 'This is the updated testtype!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedTesttype = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedTesttype = {};
    });

    it('should respond with the updated testtype', function() {
      expect(updatedTesttype.name).to.equal('Updated Testtype');
      expect(updatedTesttype.info).to.equal('This is the updated testtype!!!');
    });

  });

  describe('DELETE /api/testtypes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/testtypes/' + newTesttype._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when testtype does not exist', function(done) {
      request(app)
        .delete('/api/testtypes/' + newTesttype._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
