'use strict';

describe('Router: world', function () {

  beforeEach(module('farseerApp'));

  var route;

  beforeEach(inject(function ($route) {
    route = $route;

  }));

  describe('worlds route', function () {

    it('should map default to /worlds', function () {
      expect(route.routes["/"].redirectTo).toEqual('/worlds');
    });

  });
});
