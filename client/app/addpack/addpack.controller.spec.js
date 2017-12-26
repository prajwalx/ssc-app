'use strict';

describe('Component: AddpackComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var AddpackComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AddpackComponent = $componentController('addpack', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
