'use strict';

angular.module('handDbApp')
  .directive('board', function () {
    var controller = ['$scope', function ($scope) {
      $scope.edit = true;

      $scope.toggle = function () {

      }

      function getSuite(c){
        switch(c){
          case 'h':
            return 'hearts';
          case 'd':
            return 'diamonds';
          case 'c':
            return 'clubs';
          case 's':
            return 'spades';
        }

        return '';
      }

      $scope.updateBoard = function(){
        var boardCards = $scope.values.toLowerCase().split(',');

        //turn over all cards
        $scope.flop_card1 = Poker.getBackData(120, '#b55', '#a22');
        $scope.flop_card2 = Poker.getBackData(120, '#b55', '#a22');
        $scope.flop_card3 = Poker.getBackData(120, '#b55', '#a22');
        $scope.turn_card = Poker.getBackData(120, '#b55', '#a22');
        $scope.river_card = Poker.getBackData(120, '#b55', '#a22');

        if($scope.values.length >0) {
          for (var i = 0; i < boardCards.length; i++) {
            var card = Poker.getCardData(120, getSuite(boardCards[i][1]), boardCards[i][0]);
            switch (i) {
              case 0:
                $scope.flop_card1 = card;
                break;
              case 1:
                $scope.flop_card2 = card;
                break;
              case 2:
                $scope.flop_card3 = card;
                break;
              case 3:
                $scope.turn_card = card;
                break;
              case 4:
                $scope.river_card = card;
                break;
            }
          }
        }
        $scope.onBoardChange();
      }

      $scope.updateBoard();
    }];

    return {
      templateUrl: 'app/shared/directives/board/board.html',
      restrict: 'EA',
      scope: {
        values: '=', //@ reads the attribute value, = provides two-way binding, & works with functions
        onBoardChange: '&'
      },
      controller: controller
    };
  });
