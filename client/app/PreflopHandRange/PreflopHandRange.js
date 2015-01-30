'use strict';

angular.module('handDbApp')
  .config(function ($stateProvider, $urlRouterProvider) {

    //default view is list
    $urlRouterProvider.when('/PreflopHandRange', '/PreflopHandRange/list');

    $stateProvider
      .state('PreflopHandRange', {
        url: '/PreflopHandRange',
        controller: 'PreflopHandRangeCtrl',
        abstract: true,
        templateUrl: 'app/PreflopHandRange/PreflopHandRange.html'
      })
      .state('PreflopHandRange.list', {
        url: '/list',
        templateUrl: 'app/PreflopHandRange/PreflopHandRange.list.html'
      })
      .state('PreflopHandRange.new', {
            url: '/new',
            templateUrl: 'app/PreflopHandRange/PreflopHandRange.new.html'
     })
     .state('PreflopHandRange.edit', {
            url: '/edit/:id',
            controller: function($scope, $stateParams){
                $scope.getRange($stateParams.id);
            },
            templateUrl: 'app/PreflopHandRange/PreflopHandRange.edit.html'
     });
  });