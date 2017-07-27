/** Test suite for posts.js
 */
var request = require('request')
var post = require('./posts.js')

function url(path) {
	return "http://localhost:3001" + path
}
describe('Validate Post and Status Functionality', function() {

 it('should add posts with successive post ids, return the post each time and count the number', function(done) {
	// 	// add a new post
	// 	// verify you get the post back with an id
	// 	// verify the content of the post
	// 	// add a second post
	// 	// verify the post id increases by one
	// 	// verify the second post has the correct content
	var count;
	request(url("/posts"),function(err,res,body){
           expect(res.statusCode).toBe(200);
          count=JSON.parse(body).posts.length;
          done();
          })

	request({url:url("/post"),method:"POST",json:{body:"second one"}},function(err,res,body){
               expect(body.posts.body).toBe("second one")
               done()
              })
	request(url("/posts"),function(err,res,body){
          expect(res.statusCode).toBe(200);
          var newCount=JSON.parse(body).posts.length;
          expect(newCount).toEqual(count+1)
          done();
          })

  	}, 500)

	it('should return a post with a specified id', function(done) {
		// call GET /posts first to find an id, perhaps one at random
		// then call GET /posts/id with the chosen id
		// validate that only one post is returned
        request(url("/posts"),function(err,res,body){
            var id=JSON.parse(body).posts[1].id;
            request({url:url("/posts/" + id),method:"GET"},function(err,res,body){
			 expect(JSON.parse(body).posts.id).toBe(2)	
             done()
	   })
    })
		
	}, 500)

    it('should update the status and changed', function(done) {
		// call GET /posts/id where id is not a valid post id, perhaps 0
		// confirm that you get no results
       request({url:url("/status"),method:"PUT",json:{status:"world"}},function(err,res,body){
       	    expect(body.statuses.status).toBe("world");
			done()
		})
      request({url:url("/status"),method:"GET"},function(err,res,body){
      	      console.log(JSON.parse(body))
              expect(JSON.parse(body).statuses.status).toBe("world");
              done()
       	    })

	}, 500)

 });