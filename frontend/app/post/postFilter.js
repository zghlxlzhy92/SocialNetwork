;
(function() {
    angular.module('myApp').filter('filter', searchKeywordfilter);
    function searchKeywordfilter() {
        return function(posts, key) {
            if (!key) {
                return posts
            }
            var postArr = [];
            var keyword = key;
            //filter only by author and keyword
            angular.forEach(posts, function(post) {
                if ((post.author).match(keyword) != null || (post.body).match(keyword) != null) {
                    postArr.push(post);
                }
            })
            return postArr;
        }
    }
})()