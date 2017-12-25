'use strict';

describe('Component: EdittestComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var EdittestComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    EdittestComponent = $componentController('edittest', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
