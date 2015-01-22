'use strict';

angular.module('handDbApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('PreflopHandRange', {
        url: '/PreflopHandRange',
        templateUrl: 'app/PreflopHandRange/PreflopHandRange.html',
        controller: 'PreflopHandRangeCtrl'
      });
  });