'use strict';

describe('Component: ViewpackComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var ViewpackComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    ViewpackComponent = $componentController('viewpack', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
