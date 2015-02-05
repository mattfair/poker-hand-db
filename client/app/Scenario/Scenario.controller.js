'use strict';

angular.module('handDbApp')
  .controller('ScenarioCtrl', function ($scope, $http, socket) {

    $http.get('/api/Scenarios').success(function(scenarios) {
      $scope.scenarios = scenarios;
      socket.syncUpdates('scenarios', $scope.scenarios);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('scenarios');
    });

    $scope.createNewScenario = function (){
      $state.go("^.new");
    };

    $scope.deleteScenario = function(id) {

    };

    $scope.addAction = function(id) {
      $http.get('/api/Scenario/' + id)
        .then(function(result) {
          $scope.parent = result.data;
          $state.go("^.new");
        });
    };



  });
