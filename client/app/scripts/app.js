'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngResource',
    'ngRoute'
  ])

  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        resolve: {
          logincheck: checkLoggedin
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();

    $http.get('http://localhost:3000/auth/loggedin').then(function(user) {
      $rootScope.errorMessage = null;
      //User is Authenticated
      //console.log("User",user.data);
      if (user !== '0') {

        $rootScope.currentUser = user.data;
        deferred.resolve();
      } else { //User is not Authenticated
        $rootScope.errorMessage = 'You need to log in.';
        deferred.reject();
        $location.url('/');
      }
    }, function(err){
        $rootScope.errorMessage = 'cannot login: server error';
        deferred.reject();
        console.log("cannot login: server error");
        $location.url('/');
    });
    return deferred.promise;
  };
