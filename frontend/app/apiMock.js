(function(jasmine) {
    var $q
    var promises = []
        //make $q as a global parameter
    function init(_$q_) {
        $q = _$q_
    }
    //this function is used to mock the server to responde a request
    function makePromise(response) {
        var p = $q.defer()
        promises.push({ promise: p, response: response })
        return { $promise: p.promise }
    }
    //this function is used to mock ApiService which appears in the apiSrv.js
    var mockApiService = {
            getPosts: function() {
                return makePromise({
                    posts: [{
                        'id': 1,
                        'author': 'Test',
                        'title': 'A Test Post',
                        'date': 'Today',
                        'body': '... test post ...',
                        'comments': [{ 'commentId': 1, 'author': 'a', 'body': 'comment' }]
                    }]
                })
            },
            getEmail: function() {
                return makePromise({ username: 'Test', email: '123@123' })

            },
            getZipcode: function() {
                return makePromise({ username: 'Test', email: '77005' })
            },
            getStatus: function() {
                return makePromise({ statuses: [{ 'status': 'Test Status' }] })
            },
            setStatus: function() {
                return makePromise({ 'status': 'Was set' })
            },
            login: function() {
                return makePromise({ 'username': 'Test' })
            },
            logout: function() {
                return makePromise({ 'username': 'undefined' })
            },
            addPost: function() {
                return makePromise({ 'body': 'adding post' })
            },
            getPicture: function() {
                return makePromise({
                    pictures: [{ 'username': 'Test', 'picture': 'image_1.jpg' }]

                })
            },
            //different parameters with different situations
            updatePost: function(newPost) {
                if (newPost.commentId == -1) {
                    return makePromise({
                        'id': 1,
                        'body': 'post changed',
                        'commentId': -1

                    })
                }
                if (newPost.commentId != null && newPost.commentId != -1) {
                    return makePromise({
                        'id': 1,
                        'body': 'post changed',
                        'commentId': 1
                    })
                } else {
                    return makePromise({
                        'id': 1,
                        'body': 'post changed',

                    })
                }
            }

        }
        // this function is used to mock the server to make promises resolved
    var resolveTestPromises = function(rootScope) {
            promises.forEach(function(p) {
                p.promise.resolve(p.response)
            })
            promises.length = 0
            rootScope.$apply()
        }
        //used for the spec.js to use the function here.
    jasmine.helper = {
        init: init,
        mockApiService: mockApiService,
        resolveTestPromises: resolveTestPromises
    }

})(window.jasmine)
