;
(function() {
    angular.module('myApp')
        .controller('profileCtrl', profileCtrl)
    profileCtrl.$inject = ['api', '$location', 'UserService', '$timeout'];

    function profileCtrl(api, $location, UserService, $timeout) {
        vm = this;
        _getEmail()
        _getZipcode()
        vm.username = UserService.username;
        vm.getImage = getImage;
        vm.logout = logout;
        vm.rmain = rmain;
        vm.uploadPicture = uploadPicture;
        vm.setFile = setFile; //get upload page address
        vm.getEmail = getEmail;
        vm.getZipcode = getZipcode;
        vm.update = update;
        vm.getMessage = getMessage;
        vm.link = link;
        vm.unlink = unlink;
        var postImage;
        _isThird();
        isLink_();
        /*
          this function to  decide whether the user logs in normal way or third party
         */
        function _isThird() {
            if (UserService.facebook == 'yes') {
                vm.isThird = true
            } else {
                vm.isThird = false
            }
        }
        /*
          this function used to decide whether the user has linked before
         */
        function isLink_() {
            if (UserService.isLink == 'yes') {
                vm.isLink = true
            } else {
                vm.isLink = false

            }
        }
        /*
          when user logs in third party, then this function would work
         */
        function link(linkname, linkpassword) {
            api.linkAccount({
                username: linkname,
                password: linkpassword
            })
                .$promise.then(function(result) {

                    UserService.username = result.username;
                    alert("link successfully")
                    $timeout(relocate, 100);

                }, function() {
                    alert("The user does not exist,link fails!!")
                })
        }

        function unlink(unlinkname, unlinkpassword) {
            api.unlinkAccount({
                username: unlinkname,
                password: unlinkpassword
            })
                .$promise.then(function(result) {
                    UserService.username = result.username;
                    alert("unlink successfully")
                    $timeout(relocate, 100);

                }, function() {
                    alert("unlink fails!!")
                })
        }

        function relocate() {
            $location.path("/main")
        }

        function _getEmail() {
            api.getEmail().$promise.then(function(result) {
                UserService.email = result.email;
            })

        }
        /*get the zipcode and put it into usersevice
         */
        function _getZipcode() {
            api.getZipcode().$promise.then(function(result) {
                UserService.zipcode = result.zipcode;
            })

        }

        function logout() {
            api.logout();
            vm.username = '';
            UserService.username = undefined;
            UserService.img = undefined;
            $location.path("/login"); //when logout, redirect to the login page
        }

        function setFile(file) {
            postImage = file.files[0];
        }
        /*
         *redirect to the main page
         */
        function rmain() {
            $location.path("/main");
        }

        function getImage() {
            return UserService.img;
        }

        function getEmail() {
            return UserService.email;

        }

        function getZipcode() {
            return UserService.zipcode;
        }
        /*
         *this function is used as update the profile information
         */
        function update(email, zipcode, password, rpassword) {
            /*validate email
             */
            if (email) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                    api.updateEmail({
                        email: email
                    }).$promise.then(function(result) {
                        UserService.email = result.email;
                    })
                } else {
                    alert("email wrong")
                }
            }
            /*validate zipcode
             */
            if (zipcode) {
                if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode)) {
                    api.updateZipcode({
                        zipcode: zipcode
                    }).$promise.then(function(result) {
                        UserService.zipcode = result.zipcode;
                    })
                } else {
                    alert("zipcode wrong")
                }
            }
            if (password != null && password == rpassword) {
                getMessage()
                api.updatePwd({
                    password: password
                }).$promise.then(function(result) {})
            }
        }

        function getMessage() {
            return "will not change"
        }

        function uploadPicture() {
            api.uploadPicture({
                img: postImage
            }).$promise.then(function(result) {
                UserService.img = result.picture;
            })
        }
    }
})()