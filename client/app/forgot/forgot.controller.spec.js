'use strict';

describe('Component: ForgotComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var ForgotComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    ForgotComponent = $componentController('forgot', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
