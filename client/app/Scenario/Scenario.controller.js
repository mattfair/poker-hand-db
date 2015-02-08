'use strict';

angular.module('handDbApp')
  .controller('ScenarioCtrl', function ($scope, $http, socket, $state, HandRangeUtils) {
    $scope.scenario = {
      parent: '',
      game: '',
      hero_seat: '',
      villain_seat: '',
      defendRate: 0.6,
      actiontohero: '',
      board: '',
      valueBet: '',
      bluffBet: '',
      call: '',
      notes:''
    };

    $scope.Math=Math;

    $scope.editingHeroRangeStr = false;
    $scope.editingVillainRangeStr = false;

    $scope.heroHandRangeStr = '';
    $scope.villainHandRangeStr = '';


    $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);
    $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);

    $scope.numHeroCombos = 0;
    $scope.numVillainCombos = 0;
    $scope.numValueRaiseCombos = 0;
    $scope.numBluffRaiseCombos = 0;
    $scope.numCallCombos = 0;

    $scope.totalNumHandsDefended = 30;
    $scope.desiredNumHandsDefended = 0;

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


    $scope.$watch('numHeroCombos', function(newvalue, oldvalue) {
      $scope.updateDesiredNumHandsDefended();
    });
    $scope.$watch('scenario.defendRate', function(newvalue, oldvalue) {
      $scope.updateDesiredNumHandsDefended();
    });

    $scope.updateDesiredNumHandsDefended = function() {
      $scope.desiredNumHandsDefended=Math.floor($scope.numHeroCombos*$scope.scenario.defendRate);
    }


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
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.board);
    };

    $scope.villainRangeStringChanged = function() {
      $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.villainHandRangeStr);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.villainHandRangeStr, $scope.scenario.board);
    };

    $scope.heroRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.heroHandRange);
      $scope.heroHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.board);
    };

    $scope.villainRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.villainHandRange);
      $scope.villainHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.villainHandRangeStr, $scope.scenario.board);
    };
  });
