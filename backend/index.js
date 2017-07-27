
var express = require('express')
var bodyParser = require('body-parser')
var logger = require("morgan")
var cookieParser=require('cookie-parser')
var passport=require('passport')
var session=require('express-session')

/*
  middleware is used for any user using my server
 */
var middleware=function(req,res,next){
	res.header('Access-Control-Allow-Origin',req.get('origin'))
    res.header('Access-Control-Allow-Credentials',true)
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS')
	res.header('Access-Control-Allow-Headers','Content-Type,Authorization,Content-Length,X-Requested-With')
	if('OPTIONS'==req.method){
		return res.send(200);
	}

		 next();
}
if(process.env.NODE_ENV!=="production"){
	require('dotenv').load()
}
var app = express()
app.use(logger("default"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(middleware)
app.use(session({secret:'this is a secret'}))
app.use(passport.initialize())
app.use(passport.session())
require('./app_server/posts.js').setup(app)
require('./app_server/auth.js').setup(app)
require('./app_server/profile.js').setup(app)
require('./app_server/following.js').setup(app)
require('./app_server/auth.js').setup(app)
require('./app_server/uploadCloudinary.js').setup(app)
// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000
//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})
