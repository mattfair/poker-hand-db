'use strict';

angular.module('handDbApp')
  .controller('PreflopHandRangeCtrl', function ($scope, HandRangeUtils, $rootScope, $http, socket, $location, $state) {
        $scope.position = '';
        $scope.game = '';
        $scope.handRangeStr = '';
        $scope.editingRangeStr = false;
        $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
        $scope.preflopHandRanges = [];
        $scope.games = ['9 Max', '6 Max'];
        $scope.seats = {
          '9 Max': ['UTG', 'UTG+1','UTG+2', 'MP','MP+1','CO','Button','SB','BB'],
          '6 Max': ['UTG', 'MP', 'CO','Button','SB','BB']
        };

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
            }).then(function() {
              $scope.handRangeStr = '';
              $state.go('^.list', {}, {reload: true});
            });
        };

        $scope.deleteRange = function(id) {
            $http.delete('/api/PreflopOpeningRanges/' + id).then(function(){
              $state.go($state.current, {}, {reload: true});
            });
        };

        $scope.getRange = function(id) {
          $scope.id = id;
          $http.get('/api/PreflopOpeningRanges/' + id)
            .then(function(result) {
                $scope.handRangeStr = result.data.range;
                $scope.position = result.data.position;
                $scope.game = result.data.game;
                $scope.rangeStringChanged();
            });
        }

        $scope.saveRange = function() {
            $http.patch('/api/PreflopOpeningRanges/'+$scope.id, {
                position: $scope.position,
                game: $scope.game,
                range: $scope.handRangeStr
            }).then(function(){
              $state.go('^.list', {}, {reload: true});
            });
        }

        $scope.editRange = function(id){
            $state.go('^.edit', {id:id});
            $scope.getRange(id);
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
            var path = $location.path(); //Path without parameters
            $location.url(path);
        };

        $scope.rangeStringChanged = function() {
            $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
        };

        $scope.rangeArrayChanged = function() {
            var str = HandRangeUtils.handRangeToString($scope.handRange);
            $scope.handRangeStr = HandRangeUtils.handRangeStringCompress(str);
        };

        $scope.createNewRange = function() {
            $scope.handRangeStr = '';
            $scope.handRange = HandRangeUtils.handRangeStringToMap($scope.handRangeStr);
            $scope.position = '';
            $state.go("^.new");
        }
});
