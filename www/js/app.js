/*global angular, console, alert*/

(function () {
    'use strict';
    
    var shttr = angular.module('shttr-app', [
        'shttrControllers',
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'mgcrea.ngStrap',
        'angularUtils.directives.dirPagination'
    ]);
    
    shttr.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        
        $routeProvider.
            when('/', {
                templateUrl: './views/about.html',
                controller: 'aboutCtrl'
            }).
            when('/profile', {
                templateUrl: './views/profile.html',
                controller: 'profileCtrl'
            }).
            when('/help', {
                templateUrl: './views/help.html',
                controller: 'helpCtrl'
            }).
            when('/create_profile', {
                templateUrl: './views/create_profile.html',
                controller: 'createProfileCtrl'
            }).
            when('/edit_profile', {
                templateUrl: './views/edit_profile.html',
                controller: 'editProfileCtrl'
            }).
            otherwise({
                templateUrl: './views/home.html',
                controller: 'homeCtrl'
            });
    }]);
    
    shttr.config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs.
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }]);
    
}());