'use strict';

angular.module('handDbApp')
  .directive('board', function () {
    var controller = ['$scope', function ($scope) {
      $scope.edit = true;

      $scope.toggle = function () {

      }

      $scope.updateBoard = function(){
        var boardCards = $scope.values.split(',');

        //turn over all cards
        $scope.flop_card1 = 'assets/images/cards/Red_Back.svg';
        $scope.flop_card2 = 'assets/images/cards/Red_Back.svg';
        $scope.flop_card3 = 'assets/images/cards/Red_Back.svg';
        $scope.turn_card = 'assets/images/cards/Red_Back.svg';
        $scope.river_card = 'assets/images/cards/Red_Back.svg';

        if($scope.values.length >0) {
          for (var i = 0; i < boardCards.length; i++) {
            switch (i) {
              case 0:
                $scope.flop_card1 = 'assets/images/cards/' + boardCards[i] + '.svg';
                break;
              case 1:
                $scope.flop_card2 = 'assets/images/cards/' + boardCards[i] + '.svg';
                break;
              case 2:
                $scope.flop_card3 = 'assets/images/cards/' + boardCards[i] + '.svg';
                break;
              case 3:
                $scope.turn_card = 'assets/images/cards/' + boardCards[i] + '.svg';
                break;
              case 4:
                $scope.river_card = 'assets/images/cards/' + boardCards[i] + '.svg';
                break;
            }
          }
        }
      }

      $scope.updateBoard();
    }];

    return {
      templateUrl: 'app/shared/directives/board/board.html',
      restrict: 'EA',
      scope: {
        values: '=' //@ reads the attribute value, = provides two-way binding, & works with functions
      },
      controller: controller
    };
  });
