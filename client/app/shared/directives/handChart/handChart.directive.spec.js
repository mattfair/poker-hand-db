'use strict';

describe('Directive: handChart', function () {

  // load the directive's module and view
  beforeEach(module('handDbApp'));
  beforeEach(module('app/shared/directives/handChart/handChart.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

    /*
  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<hand-chart></hand-chart>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the handChart directive');
  }));
  */
});