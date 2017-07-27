;
(function() {
    angular.module('myApp')
        .controller('statusCtrl', statusCtrl)

    statusCtrl.$inject = ['$http', 'api', 'UserService']
    /*
     *statusCtrl is used as a controller to the status.html
     */
    function statusCtrl($http, api, UserService) {
        var vm = this;
        vm.status = '';
        getStatus();
        vm.getImage = getImage;

        vm.updateStatus = updateStatus;
        /*
         *this function is used as to receive a status from the server
         */
        function getImage() {
            return UserService.img;
        }

        function getStatus() {
            api.getStatus().$promise.then(function(result) {
                vm.status = result.statuses[0].status

            })
        }
        /*
         *this function is used as to update a new status to the server
         */
        function updateStatus() {
            api.setStatus({
                status: vm.newStatus
            }).$promise.
            then(function(result) {
                vm.status = result.statuses[0].status

            })

        }
    }

})()