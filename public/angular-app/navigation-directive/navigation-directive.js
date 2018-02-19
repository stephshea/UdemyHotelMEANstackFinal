angular.module('meanhotel').directive('mhNavigation', mhNavigation);

function mhNavigation() {
  return {
    restrict: 'E',
    //can only be used as an element
    templateUrl: 'angular-app/navigation-directive/navigation-directive.html'
  };
}