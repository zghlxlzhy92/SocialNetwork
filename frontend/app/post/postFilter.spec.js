describe('postFilter Tests',function(){
    var helper=jasmine.helper;
    var ctrl;
    var promises=[];
    beforeEach(module('myApp'))
    beforeEach(module(function($provide){
      $provide.value('api',helper.mockApiService)
    }))
    beforeEach(inject(function($controller,$rootScope,$q,api){
         helper.init($q)
         ctrl=$controller('postCtrl',{
             'api':api
         })
         ctrl._resolveTestPromises=function(){
               helper.resolveTestPromises($rootScope)
         }
         ctrl._resolveTestPromises()
    }))
    //when filter by author, then the post which meets requirments will in posts[0]
    it('filter by author',inject(function(filterFilter){
        expect(filterFilter(ctrl.posts,'Test')).toEqual([ctrl.posts[0]]);

    }))
   //when filter by body, then the post which meets requirments will in posts[0]
    it('filter by body',inject(function(filterFilter){
        expect(filterFilter(ctrl.posts,'post')).toEqual([ctrl.posts[0]]);

    }))
   //when filter by date, there should be no post
    it('can not filter by date',inject(function(filterFilter){
        expect(filterFilter(ctrl.posts,'Today')).toEqual([]);

    }))


})