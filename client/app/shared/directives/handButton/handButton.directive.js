'use strict';

angular.module('handDbApp')
  .directive('handButton', function () {
        var controller = ['$scope', function ($scope) {
            $scope.updateColor = function() {

                //FIXME: This is a hack to fix $scope.disabled is always undefined, would prefer to use the attribute instead of the parent variable
                if($scope.$parent.notInRange == undefined || $scope.$parent.notInRange[$scope.value] == false || $scope.$parent.notInRange[$scope.value] == undefined) {
                  if ($scope.active) {
                    $scope.currentColor = $scope.selectedColor;
                    $scope.currentTextColor = $scope.selectedTextColor;
                  } else {
                    $scope.currentColor = $scope.unselectedColor;
                    $scope.currentTextColor = $scope.unselectedTextColor;
                  }
                } else {
                  $scope.currentColor = "lightgray";
                  $scope.currentTextColor = "gray";
                  //make button not-pressable... because it isn't in your range
                  $scope.editable=false;
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

                $scope.updateColor();

                $scope.$watch('active', function () {
                    $scope.updateColor();
                });

                $scope.$watch('disabled', function(){
                  $scope.updateColor();
                });
            }

            init();

            $scope.toggle = function () {
                $scope.active = $scope.active ? false : true;
                $scope.updateColor();

                try {
                    $scope.$apply();
                } catch(e){
                    //don't need to do anything
                }

                $scope.notifyChange();
            }
        }];

        var template = '<button ng-style="currentStyle" ng-click="toggle()" ng-disabled="editable==false">{{value}}</button>';

        //Disable clicking for when the button is set to disabled
        var link = function (scope, element, attrs) {
            scope.$watch(scope.editable, function () {

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
                unselectedTextColor: '@', //Text color when button is unselected
                active: '=', //true when the button is selected
                editable: '@', //when true, the button can be presses
                disabled: '=' //when true, the button is grayed out and it isn't editable
            },
            controller: controller,
            template: template,
            link: link,
            replace: true


        };
  });

