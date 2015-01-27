'use strict';

angular.module('handDbApp')
  .controller('PreflopHandRangeCtrl', function ($scope, HandRangeUtils, $rootScope) {
        $scope.ShowList = 1;
        $scope.ShowRange = 0;
        $scope.position = '';
        $scope.handRangeStr = '';
        $scope.editingRangeStr = false;
        $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);


        $scope.$watch('editingRangeStr', function(newvalue, oldvalue){
            if(oldvalue == true && newvalue == false){
                $scope.rangeStringChanged();
            }
        });

        $scope.showList = function() {
            $scope.ShowList = 1;
            $scope.ShowRange = 0;
        };

        $scope.showRange = function() {
            $scope.ShowRange = 1;
            $scope.ShowList = 0;
        };

        $scope.rangeStringChanged = function() {
            $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
        };

        $scope.rangeArrayChanged = function() {
            var str = HandRangeUtils.handRangeToString($scope.handRange);
            $scope.handRangeStr = HandRangeUtils.handRangeStringCompress(str);
        };
});
