'use strict';

describe('Component: RuntestComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var RuntestComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    RuntestComponent = $componentController('runtest', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
