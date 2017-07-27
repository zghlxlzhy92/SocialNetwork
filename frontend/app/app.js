;(function() {
'use strict'

angular.module('myApp', ['ngRoute','ngResource','ui.bootstrap'])
	.config(config)
	;
/*
 *use routing to set the redirect page
 *this system will redirect among three pages(login.html,main.html.profile.html)
 */
function config($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'app/login/login.html',
		controller: 'loginCtrl',
		controllerAs: 'vm'
	})

	.when('/main', {
		templateUrl: 'app/main.html',
		controller:'mainCtrl',
		controllerAs:'vm'
	})

	.when('/profile', {
		templateUrl: 'app/profile/profile.html',
		controller:'profileCtrl',
		controllerAs:'vm'
	})
    /*
     *when there is no obvious redirect url. it will turn to login.html
     */
	.otherwise({
		redirectTo: '/login'
	})

}	

})()
