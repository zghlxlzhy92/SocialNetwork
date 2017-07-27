var isLoggedIn = require('./auth.js')
var Profile = require('./model.js').profiles
following = []
exports.setup = function(app) {
    app.get('/following/:user?', isLoggedIn.isLoggedIn, getFollowing)
    app.put('/following/:user', isLoggedIn.isLoggedIn, addFollowing)
    app.delete('/following/:user', isLoggedIn.isLoggedIn, deleteFollowing)
}
/**
 * get the following of the user
 */
function getFollowing(req, res) {
    var username = req.params.user
    if (username) {
        getProfile(username, function(items) {
            if (items[0] == undefined) {
                return res.sendStatus(404)
            } else {
                res.send({
                    username: username,
                    following: items[0].following
                })
            }
        })

    } else {
        var user = req.user
        getProfile(user, function(items) {
            if (items[0] == undefined) {
                return res.sendStatus(404)
            } else {
                res.send({
                    username: user,
                    following: items[0].following
                })
            }
        })
    }
}
/**
 * add a following to a user
 */
function addFollowing(req, res) {
    var userId = req.params.user
    var username = req.user
    getProfile(userId, function(item) {
        if (item[0] == undefined) {
            res.send({
                username: null
            })
            return
        } else {
            Profile.update({
                username: username
            }, {
                $push: {
                    following: userId
                }
            }, function(result) {
                getProfile(username, function(items) {
                    res.send({
                        username: username,
                        following: items[0].following
                    })
                })
            })
        }
    })
}
/**
 * delete a following from a user
 */
function deleteFollowing(req, res) {
    var userId = req.params.user
    var username = req.user
    getProfile(userId, function(item) {
        if (item[0] == undefined) {
            res.sendStatus(404)
            return
        } else {
            Profile.update({
                username: username
            }, {
                $pull: {
                    following: userId
                }
            }, function(result) {
                getProfile(username, function(items) {
                    res.send({
                        username: username,
                        following: items[0].following
                    })
                })
            })

        }
    })
}
/**
 * get user profile information from database
 */
function getProfile(user, callback) {
    Profile.find({
        username: user
    }).exec(function(err, items) {
        callback(items)
    })

}