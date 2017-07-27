;
(function() {
    angular.module('myApp')
        .controller('followingsCtrl', followingsCtrl)
    followingsCtrl.$inject = ['api', 'UserService']

    function followingsCtrl(api, UserService) {
        var vm = this;
        vm.followings = []
        vm.slides = [] //tuple of people waiting to be added
        vm.deleteFollowing = deleteFollowing;
        vm.Add = Add;
        vm.friend = '';
        var tempUserId;
        var tempUser;
        var tempProfile;
        var tempStatus;
        var temp;
        getFollowing();
        var _tempProfile
        var _tempStatus
        var _tempSlide
        vm.addNew = addNew;

        function getFollowing() {
            vm.followings.length = 0;
            api.getFollowing().$promise.then(function(result) {
                result.following.forEach(function(userid) {
                    api.getPicture({
                        user: userid
                    }).$promise.then(function(result) {
                        tempProfile = result.pictures[0].picture
                        tempUser = result.pictures[0].username
                        getPart(tempProfile, tempUser)
                    })
                })
            })

        }
        /**
         * @param  tempProfile [get by the callback function ]
         * @param  tempuser  [get by the callback function to get status so as to be in the following object]
         */
        function getPart(tempProfile, tempUser) {
            api.getStatuses({
                user: tempUser
            }).$promise.then(function(result) {
                tempStatus = result.statuses[0].status;
                getFull(tempProfile, tempUser, tempStatus)

            })
        }
        /*
          get the picture username and status to present on the page
         */
        function getFull(tempProfile, tempUser, tempStatus) {

            temp = {
                'profile': tempProfile,
                'user': tempUser,
                'status': tempStatus
            }
            vm.followings.push(temp)

        }
        //delete friends
        function deleteFollowing(id) {
            api.deleteFollowing({
                user: id
            }).$promise.then(function(result) {
                function findUser(user) {
                    return user.user === id
                }
                var object = vm.followings.find(findUser)
                vm.slides.push(object)
                var i = vm.followings.indexOf(object)
                vm.followings.splice(i, 1)

            })
        }

        function addNew(friend) {
            api.addFollowing({
                user: friend
            }).$promise.then(function(result) {
                if (result.username == null) {

                    alert("no such user")
                } else {
                    getFollowing();
                }
                vm.friend = ''

            })
        }
        //add friends
        function Add(id) {
            api.addFollowing({
                user: id
            }).$promise.then(function(result) {
                function findUser(user) {
                    return user.user === id
                }
                var object = vm.slides.find(findUser)
                var i = vm.slides.indexOf(object)
                vm.followings.push(object)
                vm.slides.splice(i, 1)
            })
        }
    }
})()