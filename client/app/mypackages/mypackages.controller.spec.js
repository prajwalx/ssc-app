'use strict';

describe('Component: MypackagesComponent', function () {

  // load the controller's module
  beforeEach(module('sscTestSeriesApp'));

  var MypackagesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    MypackagesComponent = $componentController('mypackages', {});
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
