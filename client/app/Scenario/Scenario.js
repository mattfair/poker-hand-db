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
          $scope.$parent.pickPosition = false;
          $scope.$parent.addAction($stateParams.id);
          $scope.$parent.isAddAction = true;
        },
        templateUrl: 'app/Scenario/Scenario.view.html'
      })
      .state('Scenario.new', {
        url: '/new',
        controller: function($scope){
          if($scope.$parent.isAddAction==false) {
            $scope.$parent.pickPosition = true;
          }
        },
        templateUrl: 'app/Scenario/Scenario.view.html'
      })
     .state('Scenario.edit', {
      url: '/edit/:id',
      controller: function($scope, $stateParams){
        $scope.$parent.pickPosition = false;
        $scope.$parent.isEdit = true;
      },
      templateUrl: 'app/Scenario/Scenario.view.html'
    });

  });
