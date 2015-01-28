'use strict';

angular.module('handDbApp')
  .controller('PreflopHandRangeCtrl', function ($scope, HandRangeUtils, $rootScope, $http, socket, $location) {
        $scope.ShowList = 1;
        $scope.ShowRange = 0;
        $scope.position = '';
        $scope.handRangeStr = '';
        $scope.editingRangeStr = false;
        $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
        $scope.preflopHandRanges = [];


        $http.get('/api/PreflopOpeningRanges').success(function(preflopHandRanges) {
            $scope.preflopHandRanges = preflopHandRanges;
            socket.syncUpdates('preflophandranges', $scope.preflopHandRanges);
        });

        $scope.addRange = function() {
            if($scope.handRangeStr === '') {
                return;
            }
            $http.post('/api/PreflopOpeningRanges', {
                position: $scope.position,
                range: $scope.handRangeStr,
                game: $scope.game,
                active: true
            });
            $scope.handRangeStr = '';
            this.showList();
        };

        $scope.deleteRange = function(id) {
            $http.delete('/api/PreflopOpeningRanges/' + id);
        };

        $scope.getRange = function(id) {
            $http.get('/api/PreflopOpeningRanges/' + id)
                .then(function(result) {
                    $scope.handRangeStr = result.data.range;
                    $scope.position = result.data.position;
                    $scope.currentId = result.data._id;
                    $scope.rangeStringChanged();
                });
        }

        $scope.saveRange = function(id) {
            $http.patch('/api/PreflopOpeningRanges/'+id, {
                range: $scope.handRangeStr
            });
            $scope.showList();
        }

        $scope.editRange = function(id){
            $scope.getRange(id);
            $scope.edit_mode = true;
            $scope.new_mode = false;
            var path = $location.path(); //Path without parameters
            $location.url(path + '?id=' + id);
            $scope.showRange();
        }

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('preflophandranges');
        });

        $scope.$watch('editingRangeStr', function(newvalue, oldvalue){
            if(oldvalue == true && newvalue == false){
                $scope.rangeStringChanged();
            }
        });

        $scope.showList = function() {
            $scope.ShowList = 1;
            $scope.ShowRange = 0;

            var path = $location.path(); //Path without parameters
            $location.url(path);
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

        $scope.createNewRange = function() {
            $scope.edit_mode = false;
            $scope.new_mode = true;
            var path = $location.path(); //Path without parameters
            $location.url(path + '?id=new');
            $scope.showRange();
        }
});
