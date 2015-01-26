'use strict';

angular.module('handDbApp')
  .controller('PreflopHandRangeCtrl', function ($scope, HandRangeUtils, $rootScope) {
        $scope.ShowList = 0;
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

        $scope.toggleShowList = function() {
            $scope.ShowList = $scope.ShowList === 1 ? 0 : 1;
        };

        $scope.toggleShowRange = function() {
            $scope.ShowRange = $scope.ShowRange === 1 ? 0 : 1;
        };

        $scope.rangeStringChanged = function() {
            $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
        };

        $scope.rangeArrayChanged = function() {
            var str = HandRangeUtils.handRangeToString($scope.handRange);
            $scope.handRangeStr = HandRangeUtils.handRangeStringCompress(str);
        };
});
