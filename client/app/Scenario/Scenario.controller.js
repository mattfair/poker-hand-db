'use strict';

angular.module('handDbApp')
  .controller('ScenarioCtrl', function ($scope, $http, socket, $state, HandRangeUtils) {
    $scope.scenario = {
      parent: '',
      game: '',
      hero_seat: '',
      hero_range: '',
      villain_seat: '',
      villain_range: '',
      defendRate: 0.6,
      actiontohero: '',
      board: '',
      valueBet: '',
      bluffBet: '',
      call: '',
      notes:'',
      short_summary: ''
    };

    $scope.Math=Math;
    $scope.preflopHandRanges = [];

    $scope.editingHeroRangeStr = false;
    $scope.editingVillainRangeStr = false;

    $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.scenario.hero_range);
    $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.scenario.hero_range);
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

    //default don't show board because it's preflop
    $scope.showBoard = false;

    //default don't show action to because it is just preflop, start out with hand ranges general action
    $scope.showActionTo = false;

    //default dont' show hand details because it is preflop
    $scope.showHandDetails = false;

    $scope.isEdit = false;

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
      var allRangesButValueRaise = HandRangeUtils.subtractFromRange($scope.scenario.hero_range, [$scope.scenario.bluffBet, $scope.scenario.call].join(','));
      allRangesButValueRaise = HandRangeUtils.handRangeStringCompress(allRangesButValueRaise);
      $scope.heroNotInRangeAndBluffCall = HandRangeUtils.notInRangeArray(allRangesButValueRaise);

      var allRangesButBluffRaise = HandRangeUtils.subtractFromRange($scope.scenario.hero_range, [$scope.scenario.valueBet, $scope.scenario.call].join(','));
      allRangesButBluffRaise = HandRangeUtils.handRangeStringCompress(allRangesButBluffRaise);
      $scope.heroNotInRangeAndRaiseCall = HandRangeUtils.notInRangeArray(allRangesButBluffRaise);

      var allRangesButCall = HandRangeUtils.subtractFromRange($scope.scenario.hero_range, [$scope.scenario.valueBet, $scope.scenario.bluffBet].join(','));
      allRangesButCall = HandRangeUtils.handRangeStringCompress(allRangesButCall);
      $scope.heroNotInRangeAndRaiseBluff = HandRangeUtils.notInRangeArray(allRangesButCall);
    }

    $scope.heroRangeStringChanged = function() {
      $scope.heroHandRange = HandRangeUtils.handRangeStringToMap($scope.scenario.hero_range);
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.scenario.hero_range, $scope.scenario.parent.board);
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.scenario.hero_range, $scope.scenario.board);
    };

    $scope.villainRangeStringChanged = function() {
      $scope.villainHandRange = HandRangeUtils.handRangeStringToMap($scope.scenario.villain_range);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.scenario.villain_range, $scope.scenario.board);
    };

    $scope.$watch('scenario.hero_seat', function (newvalue, oldvalue) {
      for (var i = 0; i < $scope.preflopHandRanges.length; i++) {
        var handRange = $scope.preflopHandRanges[i];
        if (handRange.game == $scope.scenario.game && handRange.position == newvalue) {
          $scope.scenario.hero_range = handRange.range;
          $scope.heroRangeStringChanged();
          break;
        }
      }
      $scope.updateNotInRange();
    });

    $scope.$watch('scenario.villain_seat', function (newvalue, oldvalue) {
      for (var i = 0; i < $scope.preflopHandRanges.length; i++) {
        var handRange = $scope.preflopHandRanges[i];
        if (handRange.game == $scope.scenario.game && handRange.position == newvalue) {
          $scope.scenario.villain_range = handRange.range;
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
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.scenario.hero_range, $scope.scenario.board);
    }

    $scope.updateScenario = function(scenario){
      $scope.scenario = scenario;
      $scope.heroRangeStringChanged();
      $scope.villainRangeStringChanged();
      $scope.updateNotInRange();
    }

    $scope.createNewScenario = function (){
      $scope.isAddAction=false;
      $scope.isEdit=false;
      var emptyScenario = {
        parent: '',
        game: '',
        hero_seat: '',
        hero_range: '',
        villain_seat: '',
        villain_range: '',
        defendRate: 0.6,
        actiontohero: '',
        board: '',
        valueBet: '',
        bluffBet: '',
        call: '',
        notes:'',
        short_summary: ''
      };
      $scope.updateScenario(emptyScenario);
      $state.go("^.new");
    };

    $scope.deleteScenario = function(id) {
      $http.delete('/api/Scenarios/'+id).then(function(){
        $state.go('^.list', {}, {reload: true});
      });
    };

    $scope.editScenario = function(id) {
      $http.get('/api/Scenarios/'+id).success(function(scenario) {
        $scope.id = id;

        $scope.updateScenario(scenario);
        $state.go('^.edit', {id:id});
      });
    }

    $scope.saveScenario = function() {
      if($scope.isEdit) {
        $http.patch('/api/Scenarios/'+$scope.id, $scope.scenario).then(function () {
          $state.go('^.list', {}, {reload: true});
        });
      } else {
        //create new scenario
        $http.post('/api/Scenarios', $scope.scenario).then(function () {
          $state.go('^.list', {}, {reload: true});
        });
      }
    };

    $scope.addAction = function(id) {
      $scope.isAddAction=true;
      $scope.pickPosition=false;
      $scope.isEdit=false;
      $http.get('/api/Scenarios/' + id)
        .then(function(result) {
          $scope.scenario = result.data;
          $scope.scenario.parent = id;
          delete $scope.scenario._id;
          delete $scope.scenario._v;
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
    $scope.heroRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.heroHandRange);
      $scope.scenario.hero_range = HandRangeUtils.handRangeStringCompress(str);
      $scope.numHeroCombos = HandRangeUtils.numHandCombos($scope.scenario.hero_range, $scope.scenario.parent.board);
      $scope.totalCombos = HandRangeUtils.numHandCombos($scope.scenario.hero_range, $scope.scenario.board);
    };

    $scope.villainRangeArrayChanged = function() {
      var str = HandRangeUtils.handRangeToString($scope.villainHandRange);
      $scope.scenario.villain_range = HandRangeUtils.handRangeStringCompress(str);
      $scope.numVillainCombos = HandRangeUtils.numHandCombos($scope.scenario.villain_range, $scope.scenario.board);
    };

  });
