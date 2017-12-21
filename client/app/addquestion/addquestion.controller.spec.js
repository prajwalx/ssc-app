'use strict';

describe('Component: AddquestionComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var AddquestionComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AddquestionComponent = $componentController('addquestion', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
