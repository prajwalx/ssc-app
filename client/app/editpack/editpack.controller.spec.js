'use strict';

describe('Component: EditpackComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var EditpackComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    EditpackComponent = $componentController('editpack', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
