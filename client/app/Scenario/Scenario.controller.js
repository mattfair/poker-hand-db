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
    $scope.preflopHandRanges = [];

    $scope.editingHeroRangeStr = false;
    $scope.editingVillainRangeStr = false;

    $scope.heroHandRangeStr = '';
    $scope.villainHandRangeStr = '';


    $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);
    $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.heroHandRangeStr);
    $scope.heroNotInRange = HandRangeUtils.handRangeMapNegate($scope.heroHandRange);

    $scope.numHeroCombos = 0;
    $scope.numVillainCombos = 0;
    $scope.numValueBetCombos = 0;
    $scope.numBluffBetCombos = 0;
    $scope.numCallCombos = 0;

    $scope.totalNumHandsDefended = 0;
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

    $http.get('/api/PreflopOpeningRanges').success(function(preflopHandRanges) {
      $scope.preflopHandRanges = preflopHandRanges;
      socket.syncUpdates('preflophandranges', $scope.preflopHandRanges);
    });

    $http.get('/api/Scenarios').success(function(scenarios) {
      $scope.scenarios = scenarios;
      socket.syncUpdates('scenarios', $scope.scenarios);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('scenarios');
      socket.unsyncUpdates('preflophandranges');
    });

    $scope.updateNotInRange = function() {
      var allRangesButValueRaise = HandRangeUtils.subtractFromRange($scope.heroHandRangeStr, [$scope.scenario.bluffBet, $scope.scenario.call].join(','));
      allRangesButValueRaise = HandRangeUtils.handRangeStringCompress(allRangesButValueRaise);
      $scope.heroNotInRangeAndBluffCall = HandRangeUtils.notInRangeArray(allRangesButValueRaise);

      var allRangesButBluffRaise = HandRangeUtils.subtractFromRange($scope.heroHandRangeStr, [$scope.scenario.valueBet, $scope.scenario.call].join(','));
      allRangesButBluffRaise = HandRangeUtils.handRangeStringCompress(allRangesButBluffRaise);
      $scope.heroNotInRangeAndRaiseCall = HandRangeUtils.notInRangeArray(allRangesButBluffRaise);

      var allRangesButCall = HandRangeUtils.subtractFromRange($scope.heroHandRangeStr, [$scope.scenario.valueBet, $scope.scenario.bluffBet].join(','));
      allRangesButCall = HandRangeUtils.handRangeStringCompress(allRangesButCall);
      $scope.heroNotInRangeAndRaiseBluff = HandRangeUtils.notInRangeArray(allRangesButCall);
    }

    $scope.$watch('scenario.hero_seat', function(newvalue, oldvalue) {
      for(var i=0; i<$scope.preflopHandRanges.length; i++){
        var handRange = $scope.preflopHandRanges[i];
        if(handRange.game == $scope.scenario.game && handRange.position == newvalue){
          $scope.heroHandRangeStr = handRange.range;
          $scope.heroRangeStringChanged();
          break;
        }
      }
      $scope.updateNotInRange();
    });

    $scope.$watch('scenario.villain_seat', function(newvalue, oldvalue) {
      for(var i=0; i<$scope.preflopHandRanges.length; i++){
        var handRange = $scope.preflopHandRanges[i];
        if(handRange.game == $scope.scenario.game && handRange.position == newvalue){
          $scope.villainHandRangeStr = handRange.range;
          $scope.villainRangeStringChanged();
          break;
        }
      }
    });

    $scope.$watch('numHeroCombos', function(newvalue, oldvalue) {
      $scope.updateDesiredNumHandsDefended();
    });
    $scope.$watch('scenario.defendRate', function(newvalue, oldvalue) {
      $scope.updateDesiredNumHandsDefended();
    });
    $scope.$watch('scenario.valueBet', function(newvalue, oldvalue) {
      $scope.numValueBetCombos = HandRangeUtils.numHandCombos($scope.scenario.valueBet,$scope.scenario.board);
      $scope.totalNumHandsDefended = $scope.numValueBetCombos + $scope.numBluffBetCombos + $scope.numCallCombos;
      $scope.updateNotInRange();
    });
    $scope.$watch('scenario.bluffBet', function(newvalue, oldvalue) {
      $scope.numBluffBetCombos = HandRangeUtils.numHandCombos($scope.scenario.bluffBet,$scope.scenario.board);
      $scope.totalNumHandsDefended = $scope.numValueBetCombos + $scope.numBluffBetCombos + $scope.numCallCombos;
      $scope.updateNotInRange();
    });
    $scope.$watch('scenario.call', function(newvalue, oldvalue) {
      $scope.numCallCombos = HandRangeUtils.numHandCombos($scope.scenario.call,$scope.scenario.board);
      $scope.totalNumHandsDefended = $scope.numValueBetCombos + $scope.numBluffBetCombos + $scope.numCallCombos;
      $scope.updateNotInRange();
    });

    $scope.updateDesiredNumHandsDefended = function() {
      $scope.desiredNumHandsDefended=Math.floor($scope.totalCombos*$scope.scenario.defendRate);
    }

    $scope.boardChanged = function() {
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.board);
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
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.parent.board);
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.board);
    };

    $scope.villainRangeStringChanged = function() {
      $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.villainHandRangeStr);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.villainHandRangeStr, $scope.scenario.board);
    };

    $scope.heroRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.heroHandRange);
      $scope.heroHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.parent.board);
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.heroHandRangeStr, $scope.scenario.board);
    };

    $scope.villainRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.villainHandRange);
      $scope.villainHandRangeStr = HandRangeUtils.handRangeStringCompress(str);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.villainHandRangeStr, $scope.scenario.board);
    };
  });
