'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var packCtrlStub = {
  index: 'packCtrl.index',
  show: 'packCtrl.show',
  create: 'packCtrl.create',
  update: 'packCtrl.update',
  destroy: 'packCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var packIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './pack.controller': packCtrlStub
});

describe('Pack API Router:', function() {

  it('should return an express router instance', function() {
    expect(packIndex).to.equal(routerStub);
  });

  describe('GET /api/packs', function() {

    it('should route to pack.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'packCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/packs/:id', function() {

    it('should route to pack.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'packCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/packs', function() {

    it('should route to pack.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'packCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/packs/:id', function() {

    it('should route to pack.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'packCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/packs/:id', function() {

    it('should route to pack.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'packCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/packs/:id', function() {

    it('should route to pack.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'packCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
