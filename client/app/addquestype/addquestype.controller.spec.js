'use strict';

describe('Component: AddquestypeComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var AddquestypeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AddquestypeComponent = $componentController('addquestype', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
