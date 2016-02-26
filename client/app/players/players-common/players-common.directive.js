'use strict';

angular.module('farseerApp')
  .directive('playersCommon', function () {
    return {
      templateUrl: 'app/players/players-common/players-common.html',
      restrict: 'EA'
    };
  });
