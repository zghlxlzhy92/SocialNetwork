describe('postCtrl Tests',function(){
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
    //when add a post,then posts[1] will not be null
    it('should add a post',inject(function(UserService){
        ctrl.addPost();
        ctrl._resolveTestPromises();
        expect(ctrl.posts[1]).not.toBe(null);

    }))
    // when edit a post, then the original post will be different
    it('should edit a post',inject(function(UserService){
        var test=ctrl.posts[0];
        ctrl.savePost(1);
        ctrl._resolveTestPromises();
        ctrl.loadPosts();
        expect(ctrl.posts[0]).not.toEqual(test);

    }))
    //when comment a post,then there will be a new post
   it('should comment a post',inject(function(UserService){
        var test=ctrl.posts[0];
        ctrl.addComment(1);
        ctrl._resolveTestPromises();
        expect(ctrl.posts[0]).not.toEqual(test);

    }))
   //when edit a comment, then the original one will change 
    it('should edit a comment',inject(function(UserService){
        var test=ctrl.posts[0];
        ctrl.saveComment(1,1);
        ctrl._resolveTestPromises();
        ctrl.loadPosts();
        expect(ctrl.posts[0]).not.toEqual(test);

    }))
    //test whether the username appears in controller will be equal to the Userservice username
   it('should share the username between controllers-post',inject(function(UserService){
          expect(ctrl.username).toBe(UserService.username);
   }))
  

})