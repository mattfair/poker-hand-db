'use strict';


describe('Controller: PreflopHandRangeCtrl', function () {

  // load the controller's module
  beforeEach(module('handDbApp'));

  var PreflopHandRangeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PreflopHandRangeCtrl = $controller('PreflopHandRangeCtrl', {
      $scope: scope
    });
  }));

  xit('when a card in the card map is true, it should show up in the range text', function () {
      scope.handRange["22"] = true;
      scope.$digest();
      expect(scope.handRangeStr).to.have.string("22,")
      scope.handRange["44"] = true;
      scope.$digest();
      expect(scope.handRangeStr).to.have.string("44,")
      scope.handRange["AKs"] = true;
      scope.$digest();
      expect(scope.handRangeStr).to.have.string("AKs,")
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
  })
});
