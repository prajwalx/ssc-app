'use strict';

var app = require('../..');
import request from 'supertest';

var newQuestype;

describe('Questype API:', function() {

  describe('GET /api/questypes', function() {
    var questypes;

    beforeEach(function(done) {
      request(app)
        .get('/api/questypes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          questypes = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(questypes).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/questypes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/questypes')
        .send({
          name: 'New Questype',
          info: 'This is the brand new questype!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newQuestype = res.body;
          done();
        });
    });

    it('should respond with the newly created questype', function() {
      expect(newQuestype.name).to.equal('New Questype');
      expect(newQuestype.info).to.equal('This is the brand new questype!!!');
    });

  });

  describe('GET /api/questypes/:id', function() {
    var questype;

    beforeEach(function(done) {
      request(app)
        .get('/api/questypes/' + newQuestype._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          questype = res.body;
          done();
        });
    });

    afterEach(function() {
      questype = {};
    });

    it('should respond with the requested questype', function() {
      expect(questype.name).to.equal('New Questype');
      expect(questype.info).to.equal('This is the brand new questype!!!');
    });

  });

  describe('PUT /api/questypes/:id', function() {
    var updatedQuestype;

    beforeEach(function(done) {
      request(app)
        .put('/api/questypes/' + newQuestype._id)
        .send({
          name: 'Updated Questype',
          info: 'This is the updated questype!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedQuestype = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedQuestype = {};
    });

    it('should respond with the updated questype', function() {
      expect(updatedQuestype.name).to.equal('Updated Questype');
      expect(updatedQuestype.info).to.equal('This is the updated questype!!!');
    });

  });

  describe('DELETE /api/questypes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/questypes/' + newQuestype._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when questype does not exist', function(done) {
      request(app)
        .delete('/api/questypes/' + newQuestype._id)
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
