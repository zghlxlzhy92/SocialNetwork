;
(function() {
    angular.module('myApp')
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$http', 'api', '$location', 'UserService']
    /*
      loginCtrl as a controller to the login.html
    */
    function loginCtrl($http, api, $location, UserService) {
        var vm = this;
        vm.login = login;
        vm.register = register;
        /*
          this is used for register 
          before register,we need to check first
          after register,need login to the main page
         */
        function register() {
            var testEmail = false
            var testZipcode = false
            var testPwd = false
            if (vm._username == '') {
                alert("username is needed")
            }
            if (vm.email == undefined) {
                alert("email is needed")
            }
            if (vm.zipcode == undefined) {
                alert("zipcode is needed")
            }
            if (vm._password == undefined) {
                alert("password is needed")
            }
            if (vm.rpwd == undefined) {
                alert("you still need to write password again")
            }
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(vm.email)) {
                testEmail = true
            } else {
                alert("email wrong")
            }
            /*validate zipcode
             */
            if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(vm.zipcode)) {
                testZipcode = true
            } else {
                alert("zipcode wrong")
            }
            if (vm._password == vm.rpwd) {
                testPwd = true
            } else {
                alert("password does not match")

            }
            if (testEmail && testZipcode && testPwd) {
                api.register({
                    'username': vm._username,
                    'email': vm.email,
                    'zipcode': vm.zipcode,
                    'password': vm._password
                }).$promise.then(function(result) {
                    if (result.result == 'success') {
                        alert("register successfully, please login")

                    } else {
                        alert("the user name has already existed")

                    }
                })
            }

        }
        /*
          when login, redirect to the main page
         */
        function login() {
            api.login({
                'username': vm.username,
                'password': vm.password
            })
                .$promise.then(function(result) {
                    vm.password = ''
                    vm.username = result.username
                    //getPicture()
                    getEmail()
                    getZipcode()
                    UserService.username = vm.username;
                    $location.path("/main")
                }, function() {
                    alert("The user does not exist!!")
                })

        }
        /*
        get emailaddress and put it into userservice
        */
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
    }

})()