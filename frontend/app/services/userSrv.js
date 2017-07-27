/*
 *just to share username and img.url emailaddress zipcode among pages
 **/
;(function(){
	angular.module('myApp')
	  .factory('UserService',UserService)
	function UserService(){
        return {username:'',img:'',email:'',zipcode:'',facebook:'',isLink:''}
	}
})()
