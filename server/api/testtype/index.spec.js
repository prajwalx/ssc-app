'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var testtypeCtrlStub = {
  index: 'testtypeCtrl.index',
  show: 'testtypeCtrl.show',
  create: 'testtypeCtrl.create',
  update: 'testtypeCtrl.update',
  destroy: 'testtypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var testtypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './testtype.controller': testtypeCtrlStub
});

describe('Testtype API Router:', function() {

  it('should return an express router instance', function() {
    expect(testtypeIndex).to.equal(routerStub);
  });

  describe('GET /api/testtypes', function() {

    it('should route to testtype.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'testtypeCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/testtypes/:id', function() {

    it('should route to testtype.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'testtypeCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/testtypes', function() {

    it('should route to testtype.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'testtypeCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/testtypes/:id', function() {

    it('should route to testtype.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'testtypeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/testtypes/:id', function() {

    it('should route to testtype.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'testtypeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/testtypes/:id', function() {

    it('should route to testtype.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'testtypeCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
