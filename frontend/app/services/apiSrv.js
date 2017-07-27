;(function(){
 angular.module('myApp')
	.constant('apiURL','https://zhybackserverapp.herokuapp.com')
    .factory('api', apiService) 
	.factory('api', apiService)
	function resourceUploadFile(data){
		var fd=new FormData()
		fd.append('image',data.img)
		fd.append('body',data.body)
		return fd
	}
 //use $resource to set the endpoint when use diffenent function 
function apiService($http, $resource, apiURL) {
    $http.defaults.withCredentials = true
    return $resource(apiURL + '/:endpoint/:user/:id', {user:'@user',id:'@id' }, 
		{   sample   : { method:'GET', params:{endpoint:'smaple'}},
            login    : { method:'POST', params: {endpoint: 'login'  } },
            logout   : { method: 'PUT' , params: {endpoint: 'logout'  } },
            register : { method:'POST', params: {endpoint:'register'} },
            getStatuses: { method:'GET', params: {endpoint: 'statuses'} },
            getStatus: { method:'GET', params: {endpoint: 'status'} },
			setStatus: { method:'PUT', params: {endpoint: 'status'} },
			getPosts : { method:'GET', params: {endpoint: 'posts' } },
			addPostFull : { method:'POST',headers:{'Content-Type':undefined},
			           transformRequest:resourceUploadFile,params: {endpoint:'post'}},
			updatePost:{ method:'PUT',params: {endpoint: 'posts'}},
			getPicture:{method:'GET',params:{endpoint:'pictures'}},
			uploadPicture:{method:"PUT",headers:{'Content-Type':undefined},transformRequest:
			        resourceUploadFile,params:{endpoint:'picture'}},
			updateEmail:{method:'PUT',params:{endpoint:'email'}},
			updateZipcode:{method:'PUT',params:{endpoint:'zipcode'}},
			getEmail:{method:'GET',params:{endpoint:'email'}},
			getZipcode:{method:'GET',params:{endpoint:'zipcode'}},
			updatePwd:{method:'PUT',params:{endpoint:'password'}},
			getFollowing:{method:'GET',params:{endpoint:'following'}},
			addFollowing:{method:'PUT',params:{endpoint:'following'}},
			deleteFollowing:{method:'DELETE',params:{endpoint:'following'}},
			authenticate:{method:'GET',params:{endpoint:'auth'}},
			linkAccount:{method:'POST',params:{endpoint:'link'}},
			unlinkAccount:{method:'POST',params:{endpoint:'unlink'}},
			checkAccount:{method:'POST',params:{endpoint:'check'}},
			checkLink:{method:'POST',params:{endpoint:'islink'}}
         })
}


})()