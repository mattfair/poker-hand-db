'use strict';

describe('Directive: popupHandChart', function () {

  // load the directive's module
  beforeEach(module('handDbApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<popup-hand-chart></popup-hand-chart>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the popupHandChart directive');
  }));
});
