describe('statusCtrl Tests',function(){
	  var helper=jasmine.helper;
	  var ctrl;
	  var promises=[];
	  beforeEach(module('myApp'))
	  beforeEach(module(function($provide){
	  	$provide.value('api',helper.mockApiService)
	  }))
	  beforeEach(inject(function($controller,$rootScope,$q,api){
	  	   helper.init($q)
	  	   ctrl=$controller('statusCtrl',{
	  	   	   'api':api
	  	   })
	  	   ctrl._resolveTestPromises=function(){
	  	   	     helper.resolveTestPromises($rootScope)
	  	   }
	  	   ctrl._resolveTestPromises()
	  }))
      //when update a status, the original should be changed
	  it('should update status',inject(function(UserService){
	  	  ctrl.updateStatus();
	  	  ctrl._resolveTestPromises();
	  	  expect(ctrl.status).toBe("Was set");

	  }))
	  //the username appears in controller should be equal to the username in the UserService
	 it('should share the username between controllers-status',inject(function(UserService){
          expect(ctrl.username).toBe(UserService.username);
    }))

})