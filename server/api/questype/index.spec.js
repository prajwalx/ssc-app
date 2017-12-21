'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var questypeCtrlStub = {
  index: 'questypeCtrl.index',
  show: 'questypeCtrl.show',
  create: 'questypeCtrl.create',
  update: 'questypeCtrl.update',
  destroy: 'questypeCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var questypeIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './questype.controller': questypeCtrlStub
});

describe('Questype API Router:', function() {

  it('should return an express router instance', function() {
    expect(questypeIndex).to.equal(routerStub);
  });

  describe('GET /api/questypes', function() {

    it('should route to questype.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'questypeCtrl.index')
        ).to.have.been.calledOnce;
    });

  });

  describe('GET /api/questypes/:id', function() {

    it('should route to questype.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'questypeCtrl.show')
        ).to.have.been.calledOnce;
    });

  });

  describe('POST /api/questypes', function() {

    it('should route to questype.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'questypeCtrl.create')
        ).to.have.been.calledOnce;
    });

  });

  describe('PUT /api/questypes/:id', function() {

    it('should route to questype.controller.update', function() {
      expect(routerStub.put
        .withArgs('/:id', 'questypeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('PATCH /api/questypes/:id', function() {

    it('should route to questype.controller.update', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'questypeCtrl.update')
        ).to.have.been.calledOnce;
    });

  });

  describe('DELETE /api/questypes/:id', function() {

    it('should route to questype.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'questypeCtrl.destroy')
        ).to.have.been.calledOnce;
    });

  });

});
