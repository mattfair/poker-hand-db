'use strict';

angular.module('handDbApp')
  .directive('handChart', function () {

        var controller = ['$scope', function ($scope) {

            $scope.rangeChanged = function(name) {
                $scope.callback();
            }
        }];


    return {
      templateUrl: 'app/shared/directives/handChart/handChart.html',
      restrict: 'EA',
        scope: {
            handRange: '=', //@ reads the attribute value, = provides two-way binding, & works with functions
            callback: '&',
            editable: '@',
            notInRange: '='
        },
        controller: controller
    };
  });
