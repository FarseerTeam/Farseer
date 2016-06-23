'use strict';

describe('Directive: playersCommon', function () {

  // load the directive's module and view
  beforeEach(module('farseerApp'));
  beforeEach(module('app/players/players-common/players-common.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<players-common></players-common>');
    element = $compile(element)(scope);
  }));
});
