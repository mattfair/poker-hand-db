'use strict';

angular.module('handDbApp')
  .controller('PopupHandTableCtrl', function($scope, $modalInstance, HandRangeUtils, handRangeStr){

    $scope.init = function() {
      $scope.editingRangeStr = false;
      $scope.handRangeStr = handRangeStr;
      $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
      $scope.rangeArrayChanged();
    }

    $scope.$watch('editingRangeStr', function(newvalue, oldvalue){
      if(oldvalue == true && newvalue == false){
        $scope.rangeStringChanged();
      }
    });

    $scope.rangeStringChanged = function() {
      $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
      $scope.numCombos = HandRangeUtils.numHandCombos($scope.handRangeStr);
    };

    $scope.rangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.handRange);
      $scope.handRangeStr = HandRangeUtils.handRangeStringCompress(str);
      $scope.numCombos = HandRangeUtils.numHandCombos($scope.handRangeStr);
    };

    $scope.save = function() {
      $modalInstance.close($scope.handRangeStr);
    }

    $scope.init();
  })
  .directive('popupHandTable', function ($modal) {

    var controller = ['$scope', function ($scope) {
      $scope.show = function() {
        var modalInstance = $modal.open({
          templateUrl: 'app/shared/directives/popupHandChart/popupHandChart.html',
          controller: 'PopupHandTableCtrl',
          resolve: {
            handRangeStr: function () {
              return $scope.handRange;
            }
          }
        });

        modalInstance.result.then(function (handRangeStr) {
          $scope.handRange = handRangeStr;
        }, function () {});
      }
    }];
    var template = '<button class="popupHandTableButton" ng-click="show()"></button>';
    return {
      restrict: 'EA',
      template: template,
      scope: {
        handRange: '=', //@ reads the attribute value, = provides two-way binding, & works with functions
        notInRange: '='
      },
      controller: controller
    };
  });
