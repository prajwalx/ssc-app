'use strict';

describe('Component: AddtestComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var AddtestComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AddtestComponent = $componentController('addtest', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
