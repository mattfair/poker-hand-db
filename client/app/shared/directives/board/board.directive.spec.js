'use strict';

describe('Directive: board', function () {

  // load the directive's module and view
  beforeEach(module('handDbApp'));
  beforeEach(module('app/shared/directives/board/board.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    scope.foo="";
    element = angular.element('<board values="foo"></board>');
    element = $compile(element)(scope);
    scope.$apply();
  }));
});
