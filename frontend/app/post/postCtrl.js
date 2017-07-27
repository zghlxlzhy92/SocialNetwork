;
(function() {
    angular.module('myApp')
        .controller('postCtrl', postCtrl)
    postCtrl.$inject = ['api', 'UserService']
    /*this function is used as controller function
     @param vm.isShow to decide whether to show a picture of a post
    */
    function postCtrl(api, UserService) {
        vm = this;
        vm.posts = [];
        vm.username = UserService.username;
        vm.sendPost = '';
        vm.sendPostPlus = '';
        vm.addPost = addPost;
        vm.addPostPlus = addPostPlus;
        vm.updatePost = updatePost;
        vm.savePost = savePost;
        //vm.isShow = true;
        vm.addComment = addComment;
        vm.updateComment = updateComment;
        vm.saveComment = saveComment;
        vm.loadPosts = loadPosts; 
        vm.setFile = setFile;
        vm.isShow = isShow;
        vm.author = {};
        vm.comments = {};
        var _postImage;
        loadPosts(); 
        var _postId; 
        var _commentId;
        vm.isEditPost = isEditPost;
        vm.cancel = cancel
        vm.cancelPlus = cancelPlus
        vm.delete = _delete

        function cancel() {
            vm.sendPost = ' '
        }

        function cancelPlus() {
            vm.sendPostPlus = ''
        }

        function _delete() {
            vm.newComment = ' '
        }

        function isEditPost(author) {
            if (author == UserService.username) {
                return false;
            } else {
                return true;
            }
        }
        /**
         * when loadposts it should display the author photo of a post
         * also the photo of each comment author
         */
        function loadPosts() {
            vm.posts.length = 0;
            api.getPosts().$promise.then(function(result) {
                if (result.posts[0] == undefined) {
                    vm.author[UserService.username] = UserService.img
                    vm.comments[UserService.username] = UserService.img
                } else {
                    result.posts.forEach(function(post) {
                        vm.posts.push(post);
                        api.getPicture({
                            user: post.author
                        }).$promise.then(function(result) {
                            vm.author[post.author] = result.pictures[0].picture;
                        })
                        post.comments.forEach(function(comment) {
                            api.getPicture({
                                user: comment.author
                            }).$promise.then(function(result) {
                                vm.comments[comment.author] = result.pictures[0].picture;
                            })

                        })
                    })
                }
            })
        }
        /*
          this function is used to decide whether to show the photo of a post
         */
        function isShow(x) {
            if (x.img == null) {
                return true
            } else {
                return false
            }
        }
        /*
        this function is used as add a new post
        */
        function addPost() {
            api.addPostFull({
                body: vm.sendPost
            }).$promise.
            then(function(result) {
                vm.posts.unshift(result.posts[0]);
                vm.sendPost = '';
            })
        }
        /*
         this difference from the addpost function is this also add a post with a picture
         */
        function addPostPlus() {
            if (_postImage == undefined) {
                api.addPostFull({
                    body: vm.sendPostPlus
                }).$promise.
                then(function(result) {
                    vm.posts.unshift(result.posts[0]);
                    vm.sendPostPlus = '';
                })

            } else {
                api.addPostFull({
                    body: vm.sendPostPlus,
                    img: _postImage
                }).$promise.
                then(function(result) {
                    vm.posts.unshift(result.posts[0]);
                    vm.sendPostPlus = '';
                    var preview = document.getElementById("post");
                    preview.src = " "
                })
            }
        }
        /*this function is used as check whether the user has the authority to change a post
          @postId: the id of a specific post
        */
        function updatePost(postId) {
            _postId = postId;
            var postuser;
            var _post;
            var index = vm.posts.findIndex(function(post) {
                return post.id === _postId
            })
            _post = vm.posts[index].body; //get the post content so can be displayed in the change arear
            vm.body = _post;
        }
        /*this function is used as update a post when a user has changed the post
         */
        function savePost() {
            api.updatePost({
                id: _postId,
                body: vm.body
            }).$promise.then(function(result) {
                vm.body = '';
                var index = vm.posts.findIndex(function(post) {
                    return post.id === _postId
                })
                vm.posts[index].body = result.posts[0].body;
            })
        }
        /*this function is used as add a new comment
         @postId is the postid which a comment should comment on
         */
        function addComment(postId) {
            api.updatePost({
                id: postId,
                body: vm.newComment,
                commentId: -1
            }).$promise.
            then(function(result) {
                var index = vm.posts.findIndex(function(post) {
                    return post.id === result.posts[0].id
                })
                var length = result.posts[0].comments.length
                vm.posts[index].comments.push(result.posts[0].comments[length - 1])
                vm.newComment = '';
            })
        }
        /**
          this function  is used as to check whether the user has the authority to change a comment
          @postId: id of a post
          @commentId :id of a comment
          */
        function updateComment(postId, commentId, _bool) {
            _postId = postId;
            _commentId = commentId;
            var commentUser;
            var _comment;
            var index2;
            //get the index of a pecific post
            var index1 = vm.posts.findIndex(function(post) {
                return post.id === postId
            })

            for (var i = 0; i < vm.posts[index1].comments.length; i++) //to get the commentindex of the specific comment in a specific post
            {
                if (vm.posts[index1].comments[i].commentId == commentId) {
                    index2 = i;
                }
            }
            _comment = vm.posts[index1].comments[index2].body; //the commentbody of a specific comment so that that can be displayed in the change area
            vm.commentBody = _comment;

        }
        /*
         *this function is used as previewing the upload page
         */
        function setFile(file) {
            var preview = document.getElementById("post1");
            var file = file.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function() {
                preview.src = reader.result;
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
            _postImage = file;
        }

        function saveComment(isTrue) {
            api.updatePost({
                id: _postId,
                body: vm.commentBody,
                commentId: _commentId
            }).$promise.then(function(result) {
                var index2;
                //get the index of a pecific post
                var index1 = vm.posts.findIndex(function(post) {
                    return post.id === _postId
                })
                for (var i = 0; i < vm.posts[index1].comments.length; i++) //to get the commentindex of the specific comment in a specific post
                {
                    if (vm.posts[index1].comments[i].commentId == _commentId) {
                        index2 = i;
                    }
                }
                vm.posts[index1].comments[index2]['body'] = vm.commentBody
                vm.commentBody = '';
            })
        }
    }
})()