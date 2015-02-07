'use strict';


describe('Controller: PreflopHandRangeCtrl', function () {

  // load the controller's module
  beforeEach(module('handDbApp'));
  beforeEach(module('socketMock'));

  var PreflopHandRangeCtrl, scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/PreflopOpeningRanges').respond({});

    scope = $rootScope.$new();
    PreflopHandRangeCtrl = $controller('PreflopHandRangeCtrl', {
      $scope: scope
    });
  }))

  xit('when a card in the card map is true, it should show up in the range text', function () {
      scope.$apply(function() {scope.handRange["22"] = true;});
      expect(scope.handRangeStr).to.have.string("22,");
      scope.$apply(function() {scope.handRange["44"] = true;});
      expect(scope.handRangeStr).to.have.string("44,");
      scope.$apply(function() {scope.handRange["AKs"] = true;});
      expect(scope.handRangeStr).to.have.string("AKs,");
  });


  it('when a card range is added to the range text field, it is selected in the card map', function(){


      scope.editingRangeStr=true;
      scope.handRangeStr = "22";
      scope.$digest();
      scope.editingRangeStr=false;
      scope.$digest();
      expect(scope.handRange[22]).to.be.true;

      scope.editingRangeStr=true;
      scope.handRangeStr += ",44";
      scope.$digest();
      scope.editingRangeStr=false;
      scope.$digest();
      expect(scope.handRange[22]).to.be.true;

      scope.editingRangeStr=true;
      scope.handRangeStr += ",AKs";
      scope.$digest();
      scope.editingRangeStr=false;
      scope.$digest();
      expect(scope.handRange[22]).to.be.true;
  });


});
