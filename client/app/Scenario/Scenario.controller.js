'use strict';

angular.module('handDbApp')
  .controller('ScenarioCtrl', function ($scope, $http, socket, $state, HandRangeUtils) {
    $scope.scenario = {
      parent: String,
      game: String,
      hero_seat: String,
      villain_seat: String,
      actiontohero: String,
      board: String,
      valueBet: String,
      bluffBet: String,
      call: String,
      notes: String
    };

    $scope.editingHeroRangeStr = false;
    $scope.editingVillainRangeStr = false;

    $scope.heroHandRangeStr = '';
    $scope.villainHandRangeStr = '';


    $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);
    $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);

    $scope.pickPosition = false;
    $scope.games = ['9 Max', '6 Max'];
    $scope.seats = {
      '9 Max': ['UTG', 'UTG+1','UTG+2', 'MP','MP+1','CO','Button','SB','BB'],
      '6 Max': ['UTG', 'MP', 'CO','Button','SB','BB']
    };

    $scope.parentHandSource = [
      {name:'Value Bet', source:$scope.scenario.parent.valueBet},
      {name:'Bluff Bet', source:$scope.scenario.parent.bluffBet},
      {name:'Call', source:$scope.scenario.parent.call}];

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

    $scope.$watch('editingHeroRangeStr', function(newvalue, oldvalue){
      if(oldvalue == true && newvalue == false){
        $scope.heroRangeStringChanged();
      }
    });

    $scope.$watch('editingVillainRangeStr', function(newvalue, oldvalue){
      if(oldvalue == true && newvalue == false){
        $scope.villainRangeStringChanged();
      }
    });
    $scope.heroRangeStringChanged = function() {
      $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);
    };

    $scope.villainRangeStringChanged = function() {
      $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.villainHandRangeStr);
    };

    $scope.heroRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.heroHandRange);
      $scope.heroHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
    };

    $scope.villainRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.villainHandRange);
      $scope.villainHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
    };
  });
