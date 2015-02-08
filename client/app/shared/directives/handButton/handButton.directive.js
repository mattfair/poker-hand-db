'use strict';

angular.module('handDbApp')
  .directive('handButton', function () {
        var controller = ['$scope', function ($scope) {
            function updateColor($scope) {
                if ($scope.active) {
                    $scope.currentColor = $scope.selectedColor;
                    $scope.currentTextColor = $scope.selectedTextColor;
                } else {
                    $scope.currentColor = $scope.unselectedColor;
                    $scope.currentTextColor = $scope.unselectedTextColor;
                }
                $scope.currentStyle = {
                    height: "38px",
                    width: "38px",
                    'background-color': $scope.currentColor,
                    'color': $scope.currentTextColor
                };
            }

            function init() {
                if ($scope.active == undefined) {
                    $scope.active = false;
                }

                updateColor($scope);

                $scope.$watch('active', function (value) {
                    updateColor($scope);
                });
            }

            init();

            $scope.toggle = function () {
                $scope.active = $scope.active ? false : true;
                updateColor($scope);

                try {
                    $scope.$apply();
                } catch(e){
                    //don't need to do anything
                }

                $scope.notifyChange();
            }
        }];

        var template = '<button ng-style="currentStyle" ng-click="toggle()" ng-disabled="editable==false||editable==\"false\"">{{value}}</button>';

        //Disable clicking for when the button is set to disabled
        var link = function (scope, element, attrs) {
            scope.$watch(scope.editable, function (value) {

                if (scope.editable == false || scope.editable == "false" || scope.editable == undefined) {
                    element.attr("disabled", "disabled");
                    $(element).click(function (event) {
                        event.preventDefault();
                    });
                } else {
                    element.removeAttr("disabled");
                }
            });
        };

        return {
            restrict: 'EA', //Default in 1.3+
            scope: {
                notifyChange: '&',
                value: '@', //Text to be displayed (i.e. AKs, AJo, etc)
                selectedColor: '@', //Color when button is selected
                selectedTextColor: '@', //Text color when button is selected
                unselectedColor: '@', //Color when button is unselected
                unselectedTextColor: '@', //Text color when button is unselecte
                active: '=',
                editable: '@'
            },
            controller: controller,
            template: template,
            link: link,
            replace: true


        };
  });

