describe('loginCtrl Tests',function(){
	  var helper=jasmine.helper;
	  var ctrl;
	  var promises=[];
	  beforeEach(module('myApp'))
	  beforeEach(module(function($provide){
	  	$provide.value('api',helper.mockApiService)
	  }))
	  beforeEach(inject(function($controller,$rootScope,$q,api){
	  	   helper.init($q)
	  	   ctrl=$controller('loginCtrl',{
	  	   	   'api':api
	  	   })
	  	   ctrl._resolveTestPromises=function(){
	  	   	     helper.resolveTestPromises($rootScope)
	  	   }
	  	   ctrl._resolveTestPromises()
	  }))
     //test when login, the username has been updated in the UserService
	  it('should login',inject(function(UserService){
	  	  ctrl.login();
	  	  ctrl._resolveTestPromises();
	  	  expect(UserService.username).toBe("Test");
	  }))
})