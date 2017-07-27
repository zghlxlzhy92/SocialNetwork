// this is model.js 
var mongoose = require('mongoose')
require('./db.js')
/**
 * create three schema
 * userschema
 * profileschema
 * postschema
 */
var userSchema = new mongoose.Schema({
	username: String, salt: String, hash: String
})
var authSchema= new mongoose.Schema({
	username:String,facebook:String
})
var profilesSchema=new mongoose.Schema({
	username:String, status: String, following:[String], email:String,
	zipcode:String,picture:String
})
var postsSchema=new mongoose.Schema({
	id:String,author:String,body:String,date:Date,img:String,comments:[{commentId:String,
		author:String,body:String,date:Date}]
})

exports.user = mongoose.model('user', userSchema)
exports.profiles=mongoose.model('profiles',profilesSchema)
exports.posts=mongoose.model('posts',postsSchema)
exports.auth=mongoose.model('auth',authSchema)
