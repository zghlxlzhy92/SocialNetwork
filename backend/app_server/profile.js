var Profile = require('./model.js').profiles
var User = require('./model.js').user
var auth = require('./model.js').auth
var isLoggedIn = require('./auth.js')
var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')
var uploadImage = multer().single('image')
var md5 = require('md5')
exports.uploadImage = uploadImage

exports.setup = function(app) {
    app.get('/statuses/:users*?', isLoggedIn.isLoggedIn, getStatuses)
    app.get('/status', isLoggedIn.isLoggedIn, getStatus)
    app.put('/status', isLoggedIn.isLoggedIn, updateStatus)
    app.get('/email/:user?', isLoggedIn.isLoggedIn, getEmail)
    app.put('/email', isLoggedIn.isLoggedIn, updateEmail)
    app.get('/zipcode/:user?', isLoggedIn.isLoggedIn, getZipcode)
    app.put('/zipcode', isLoggedIn.isLoggedIn, updateZipcode)
    app.get('/pictures/:user?', isLoggedIn.isLoggedIn, getPicture)
    app.put('/picture', isLoggedIn.isLoggedIn, uploadImage, updatePicture)
    app.put('/password', isLoggedIn.isLoggedIn, updatePassword)
}

var statuses = []
var pictures = []

/*get status from request user from database
 */
function getStatuses(req, res) {
    statuses.length = 0;
    var userlist = req.params.users
    var usernameArray = userlist.split(',');
    var lengthArray = usernameArray.length;
    var temp = 0
    usernameArray.forEach(function(user) {
        getProfile(user, function(profile) {
            if (profile[0] == undefined) {
                res.sendStatus(404)
            } else {
                var status = profile[0].status
                statuses.unshift({
                    username: user,
                    status: status
                })
                tempStatuses(statuses, temp)
                temp++
            }
        })
    })

    function tempStatuses(statuses, j) {
        if ((++j) == lengthArray) {
            res.send({
                statuses: statuses
            })
        }
    }
}
/*
   get status from loggin user from database
 */
function getStatus(req, res) {
    statuses.length = 0;
    var user = req.user;
    getProfile(user, function(profile) {
        if (profile[0] == undefined) {
            res.sendStatus(404);
        } else {
            var status = profile[0].status
            statuses.unshift({
                username: user,
                status: status
            })
            res.send({
                statuses: statuses
            })
        }
    })

}
/**
 * @param  original original data
 * @param  update waiting to be update
 */
function updateStatus(req, res) {
    statuses.length = 0;
    var newStatus = req.body.status
    var username = req.user
    getProfile(username, function(profile) {
        if (profile[0] == undefined) {
            res.sendStatus(401)
        } else {
            var original = {
                status: profile[0].status
            }
            var update = {
                status: newStatus
            }
            updateProfile(original, update, function(items) {
                statuses.unshift({
                    username: username,
                    status: newStatus
                })
                res.send({
                    statuses: statuses
                })
            })
        }
    })
}
/*
   get email information from database and display on te profile page
 */
function getEmail(req, res) {
    var username = req.params.user
    if (username) {
        getProfile(username, function(profile) {
            if (profile[0] == undefined) {
                res.sendStatus(404)
            } else {
                var email = profile[0].email
                res.send({
                    username: username,
                    email: email
                })
            }
        })

    } else {
        var user = req.user
        getProfile(user, function(profile) {
            if (profile[0] == undefined) {
                res.sendStatus(404)
            } else {
                var email = profile[0].email
                res.send({
                    username: user,
                    email: email
                })
            }
        })
    }
}
/*
 update the email information in the database
 */
function updateEmail(req, res) {
    var newEmail = req.body.email
    var username = req.user
    getProfile(username, function(profile) {
        if (profile[0] == undefined) {
            res.sendStatus(401)
        } else {
            var original = {
                email: profile[0].email
            }
            var update = {
                email: newEmail
            }
            updateProfile(original, update, function(items) {
                res.send({
                    username: username,
                    email: newEmail
                })

            })
        }
    })
}

function getZipcode(req, res) {
    var username = req.params.user
    if (username) {
        getProfile(username, function(profile) {
            if (profile[0] == undefined) {
                res.send(404)
            } else {
                var zipcode = profile[0].zipcode
                res.send({
                    username: username,
                    zipcode: zipcode
                })
            }
        })

    } else {
        var user = req.user
        getProfile(user, function(profile) {
            if (profile[0] == undefined) {
                res.send(404)
            } else {
                var zipcode = profile[0].zipcode
                res.send({
                    username: user,
                    zipcode: zipcode
                })
            }
        })
    }
}

function updateZipcode(req, res) {
    var newZipcode = req.body.zipcode
    var username = req.user
    getProfile(username, function(profile) {
        if (profile[0] == undefined) {
            res.sendStatus(401)
        } else {
            var original = {
                zipcode: profile[0].zipcode
            }
            var update = {
                zipcode: newZipcode
            }
            updateProfile(original, update, function(items) {
                res.send({
                    username: username,
                    zipcode: newZipcode
                })

            })
        }
    })
}
/*
   get picture from the loggin user or request user
 */
function getPicture(req, res) {
    var username = req.params.user
    if (!username) {
        var user = req.user
        pictures.length = 0
        getProfile(user, function(items) {
            if (items.length == 0) {
                res.sendStatus(404)
            } else {
                pictures.push({
                    username: user,
                    picture: items[0].picture
                })
                res.send({
                    pictures: pictures
                })
            }
        })

    } else {
        getProfile(username, function(items) {
            if (items[0] == undefined) {
                res.sendStatus(404)
            } else {
                pictures.length = 0
                pictures.push({
                    username: username,
                    picture: items[0].picture
                })
                res.send({
                    pictures: pictures
                })
            }
        })
    }
}

function updatePicture(req, res) {
    if (!req.file) {
        res.sendStatus(400)
        return
    }
    var publicName = new Date().getTime()
    var uploadStream = cloudinary.uploader.upload_stream(function(result) {
        if (result.url == undefined) {
            res.sendStatus(401)
        } else {
            getProfile(req.user, function(items) {
                original = {
                    picture: items[0].picture
                }
                update = {
                    picture: result.url
                }
                updateProfile(original, update, function(item) {
                    res.send({
                        username: req.user,
                        picture: result.url
                    })
                })
            })
        }
    }, {
        public_id: publicName
    })
    var s = new stream.PassThrough()
    s.end(req.file.buffer)
    s.pipe(uploadStream)
    s.on('end', uploadStream.end)
}
/**
 * @return status:will not chage [password are not allowed to be change at this time]
 */
function updatePassword(req, res) {
    var password = req.body.password
    var username = req.user
    res.send({
        username: username,
        status: 'will not change'
    })
}

function getProfile(username, callback) {
    Profile.find({
        username: username
    }).exec(function(err, items) {
        callback(items)
    })
}

function updateProfile(original, update, callback) {
    Profile.update(original, update).exec(function afterwards(err, items) {
        callback(items)
    })
}

function getUser(username, callback) {
    User.find({
        username: username
    }).exec(function(err, items) {
        callback(items)
    })
}