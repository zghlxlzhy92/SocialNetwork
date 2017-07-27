var isLoggedIn = require('./auth.js')
var Post = require('./model.js').posts
var Profile = require('./model.js').profiles
var md5 = require('md5')
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')
var uploadImage = multer().single('image')
exports.uploadImage = uploadImage

exports.setup = function(app) {
    app.get('/posts/:id*?', isLoggedIn.isLoggedIn, getPost)
    app.put('/posts/:id', isLoggedIn.isLoggedIn, updatePost)
    app.post('/post', isLoggedIn.isLoggedIn, uploadImage, addPost)
    app.get('/', start)
}
var posts = [];
var usersToQuery = [];

function start(req, res) {
    res.send({
        hello: 'world'
    })
}
/**
 * this is used to getposts from the user and his followings
 * and sort by time
 */
function getPost(req, res) {
    posts.length = 0
    usersToQuery.length = 0
    var id = req.params.id
    if (!id) {
        var username = req.user
        getProfile(username, function(items) {
            if (items[0] == undefined) {
                return res.sendStatus(401)
            } else {
                usersToQuery = [items[0].username]
                usersToQuery = usersToQuery.concat(items[0].following)
                Post.find({
                    author: {
                        $in: usersToQuery
                    }
                }).limit(10).sort({
                    date: -1
                })
                    .exec(function(err, items) {
                        posts = items;
                        res.send({
                            posts: items
                        })
                    })
            }
        })
    } else {
        getPostsById(id, function(item) {
            if (item[0] != undefined) {
                res.send({
                    posts: item
                });
            } else {
                res.sendStatus(401);
            }
        })
    }
}
/*
  add post 
 */
function addPost(req, res) {
    var username = req.user
    var body = req.body.body
    var image = req.body.image
    var id = md5(body + new Date().getTime())
    var date = new Date()
    if (req.file == undefined) {
        new Post({
            id: id,
            author: username,
            body: body,
            date: date,
            img: null,
            comments: []
        }).save();
        posts.unshift({
            id: id,
            author: username,
            body: body,
            date: date,
            img: null,
            comments: []
        });
        res.send({
            posts: posts
        })

    } else {
        var publicName = new Date().getTime()
        var uploadStream = cloudinary.uploader.upload_stream(function(result) {
            new Post({
                id: id,
                author: username,
                body: body,
                date: date,
                img: result.url,
                comments: []
            }).save();
            posts.unshift({
                id: id,
                author: username,
                body: body,
                date: date,
                img: result.url,
                comments: []
            });
            res.send({
                posts: posts
            })


        }, {
            public_id: publicName
        })
        var s = new stream.PassThrough()
        s.end(req.file.buffer)
        s.pipe(uploadStream)
        s.on('end', uploadStream.end)
    }

}
/**
 * @param  commentId [used to decide whether to update a post or a comment or add a comment]
 * @param  body [could by a comment body or a post body]
 * @param  id [post id]
 * have three parts which can update the comment or post
 * @return posts
 */
function updatePost(req, res) {
    posts.length = 0;
    var id = req.params.id
    var body = req.body.body
    var commentId = req.body.commentId
    var username = req.user
    if (!commentId) {
        getPostsById(id, function(items) {
            if (items[0] == undefined) {
                res.sendStatus(401)
            } else {
                var original = {
                    body: items[0].body
                }
                var update = {
                    body: body
                }
                updatePostBody(original, update, function(items) {
                    getPostsById(id, function(items) {
                        res.send({
                            posts: items
                        })
                    })
                })
            }
        })
    }

    if (commentId == -1) {
        getPostsById(id, function(items) {
            if (items[0] == undefined) {
                res.sendStatus(401)
            } else {
                var commentId = md5(body + new Date().getTime())
                var date = new Date()
                var newComments = {
                    commentId: commentId,
                    author: username,
                    body: body,
                    date: date
                }
                Post.update({
                    id: id
                }, {
                    $push: {
                        comments: newComments
                    }
                }, function(result) {
                    getPostsById(id, function(items) {
                        res.send({
                            posts: items
                        })
                    })
                })
            }
        })
    }
    if (commentId && commentId != -1) {
        getPostsById(id, function(items) {
            if (items[0] == undefined) {
                res.sendStatus(401)
            } else {
                var original = {
                    id: id,
                    "comments.commentId": commentId
                }
                var update = {
                    $set: {
                        "comments.$.body": body
                    }
                }
                updatePostBody(original, update, function(items) {
                    getPostsById(id, function(item) {
                        res.send({
                            posts: item
                        })
                    })
                })
            }
        })
    }
}
/*
  get user information from databases
 */
function getProfile(username, callback) {
    Profile.find({
        username: username
    }).exec(function(err, items) {
        callback(items)
    })
}
/*
  get posts from database
 */
function getPosts(username, callback) {
    Post.find({
        author: username
    }).exec(function(err, items) {
        callback(items)
    })
}
/*
  get a post for a specific id from database
 */
function getPostsById(id, callback) {
    Post.find({
        id: id
    }).exec(function(err, items) {
        callback(items)
    })

}
/*
  update a post in the database
 */
function updatePostBody(original, update, callback) {
    Post.update(original, update).exec(function afterwards(err, items) {
        callback(items)
    })
}