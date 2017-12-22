'use strict';

describe('Component: AddtesttypeComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var AddtesttypeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AddtesttypeComponent = $componentController('addtesttype', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
