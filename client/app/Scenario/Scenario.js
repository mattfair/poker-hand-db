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
      .state('Scenario.new', {
        url: '/new',
        templateUrl: 'app/Scenario/Scenario.new.html'
      });

  });
