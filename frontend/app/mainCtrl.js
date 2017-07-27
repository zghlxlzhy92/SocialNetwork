;
(function() {
    angular.module('myApp')
        .controller('mainCtrl', mainCtrl)
    mainCtrl.$inject = ['api', 'UserService', '$location']
    /*
     *mainCtrl as a controller to the main.html
     */
    function mainCtrl(api, UserService, $location) {
        vm = this;
        checkAccount();
        vm.logout = logout;
        vm.rProfile = rProfile;
        getPicture()
        vm.getUser = getUser
        _isLink()

        function getUser() {
            return UserService.username
        }
        /*
           this function is used to see whether the user and thirdparty has linked,and set 
           Userservice
         */
        function _isLink() {
            api.checkLink().$promise.then(function(result) {
                if (result.result == 'yes') {
                    vm.isLink = true
                    UserService.isLink = 'yes'
                } else {
                    vm.isLink = false
                    UserService.isLink = 'no'
                }
            })
        }
        /*
           this function is used to check the way the user logs in, when logs in third party, it needs to get
           user information
         */
        function checkAccount() {
            api.checkAccount().$promise.then(function(result) {
                if (result.check == 'yes') {
                    UserService.facebook = 'yes'
                    UserService.username = result.username
                    getEmail()
                    getZipcode()

                }
                if (result.check == 'no') {
                    UserService.facebook = 'no'
                    UserService.username = result.username
                }
            })
        }

        function getEmail() {
            api.getEmail().$promise.then(function(result) {
                UserService.email = result.email;
            })

        }
        /*get the zipcode and put it into usersevice
         */
        function getZipcode() {
            api.getZipcode().$promise.then(function(result) {
                UserService.zipcode = result.zipcode;
            })

        }
        /*
        this function is used to get the profile picture of the user and remeber the url in the Userservice
        so main.html and profile.html will share this url
        */
        function getPicture() {
            api.getPicture().$promise.then(function(result) {
                UserService.img = result.pictures[0].picture;
            })
        }
       function logout() {
            api.logout();
            vm.username = '';
            UserService.username = undefined;
            UserService.img = undefined;
            $location.path("/login");
        }
        /*
         *this function is used as to redirect to the profile.html
         */
        function rProfile() {
            $location.path("/profile");
        }

    }


})()