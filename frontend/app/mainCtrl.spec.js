describe('mainCtrl Tests',function(){
	  var helper=jasmine.helper;
	  var ctrl;
	  var promises=[];
	  beforeEach(module('myApp'))
	  //before each test we will use the mock apiService
	  beforeEach(module(function($provide){
	  	$provide.value('api',helper.mockApiService)
	  }))
     beforeEach(inject(function($controller,$rootScope,$q,api){
	  	   helper.init($q)
	  	   ctrl=$controller('mainCtrl',{
	  	   	   'api':api
	  	   })
	  	   ctrl._resolveTestPromises=function(){
	  	   	     helper.resolveTestPromises($rootScope)
	  	   }
	  	   ctrl._resolveTestPromises()
	  }))
    //use the logout()to test whether the username has been cleared by the mock server
     it('should logout',inject(function(UserService){
	  	  ctrl.logout();
	  	  ctrl._resolveTestPromises();
	  	  expect(UserService.username).not.toBeDefined()
	  }))
})