'use strict';

var app = require('../..');
import request from 'supertest';

var newPack;

describe('Pack API:', function() {

  describe('GET /api/packs', function() {
    var packs;

    beforeEach(function(done) {
      request(app)
        .get('/api/packs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          packs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(packs).to.be.instanceOf(Array);
    });

  });

  describe('POST /api/packs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/packs')
        .send({
          name: 'New Pack',
          info: 'This is the brand new pack!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPack = res.body;
          done();
        });
    });

    it('should respond with the newly created pack', function() {
      expect(newPack.name).to.equal('New Pack');
      expect(newPack.info).to.equal('This is the brand new pack!!!');
    });

  });

  describe('GET /api/packs/:id', function() {
    var pack;

    beforeEach(function(done) {
      request(app)
        .get('/api/packs/' + newPack._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          pack = res.body;
          done();
        });
    });

    afterEach(function() {
      pack = {};
    });

    it('should respond with the requested pack', function() {
      expect(pack.name).to.equal('New Pack');
      expect(pack.info).to.equal('This is the brand new pack!!!');
    });

  });

  describe('PUT /api/packs/:id', function() {
    var updatedPack;

    beforeEach(function(done) {
      request(app)
        .put('/api/packs/' + newPack._id)
        .send({
          name: 'Updated Pack',
          info: 'This is the updated pack!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPack = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPack = {};
    });

    it('should respond with the updated pack', function() {
      expect(updatedPack.name).to.equal('Updated Pack');
      expect(updatedPack.info).to.equal('This is the updated pack!!!');
    });

  });

  describe('DELETE /api/packs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/packs/' + newPack._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when pack does not exist', function(done) {
      request(app)
        .delete('/api/packs/' + newPack._id)
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
