'use strict';

angular.module('handDbApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    //default view is list
    $urlRouterProvider.when('/', '/Scenario/list');

    $stateProvider
      .state('Scenario', {
        url: '/Scenario',
        templateUrl: 'app/Scenario/Scenario.html',
        controller: 'ScenarioCtrl'
      })
      .state('Scenario.list', {
        url: '/list',
        templateUrl: 'app/Scenario/Scenario.list.html'
      })
      .state('Scenario.add', {
        url: '/AddAction/:id',
        controller: function($scope, $stateParams){
          $scope.pickPosition = false;
          $scope.addAction($stateParams.id);
        },
        templateUrl: 'app/Scenario/Scenario.view.html'
      })
      .state('Scenario.new', {
        url: '/new',
        controller: function($scope){
          $scope.pickPosition = true;
        },
        templateUrl: 'app/Scenario/Scenario.view.html'
      });

  });
