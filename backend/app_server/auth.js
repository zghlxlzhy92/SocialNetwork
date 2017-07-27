var User = require('./model.js').user
var Profile = require('./model.js').profiles
var auth = require('./model.js').auth
var passport = require('passport')
var session = require('express-session')
var md5 = require('md5')
var REDIS_URL = 'redis://h:p6ulabr8ftqgc662gjjneq8qjtm@ec2-54-235-164-4.compute-1.amazonaws.com:24909'
var redis = require('redis').createClient(REDIS_URL)
var FacebookStrategy = require('passport-facebook').Strategy
var config = {
    clientSecret: '2be3e909b7c82fe520e24a27247140d8',
    clientID: '1058010520939992',
    callbackURL: 'http://zhybackserverapp.herokuapp.com/callback',

}
var users = {}
    /**
     * this function is used as to check whether the user is authorized
     * and used before other payloads
     */
exports.isLoggedIn = function(req, res, next) {
    var sid = req.cookies[_cookieKey]
    if (!sid) {
        return res.sendStatus(401)
    }
    req.user = _sessionUser[sid][0].username
    next();
}

exports.setup = function(app) {
    app.post('/register', register)
    app.post('/login', login) //have check the authentication in the function instead of using is loggedin
    app.put('/logout', logout)
    app.get('/auth', passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.get('/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/fail'
    }));
    app.get('/profile', profile);
    app.get('/fail', fail);
    app.post('/check', checkAccount)
    app.post('/unlink', unlinkAccount)
    app.post('/link', linkAccount)
    app.post('/islink', islink)

}
/*
   this function is used to check whether the user has linked with facebook
 */
function islink(req, res) {
    var sid = req.cookies[_cookieKey]
    if (!sid) {
        return res.sendStatus(401)
    }
    var username = _sessionUser[sid][0].username
    getAuth_(username, function(items) {
        if (items[0] == undefined) {
            res.send({
                result: 'no'
            })
            return
        }
        if (items[0].facebook == username) {
            res.send({
                result: 'no'
            })
            return
        } else {
            res.send({
                result: 'yes'
            })
            return
        }
    })
}
/*
    this function is used to link the user with facebook
 */
function linkAccount(req, res) {
    var user = req.user.displayName
    var username = req.body.username
    var password = req.body.password
    if (!username || !password) {
        res.sendStatus(400)
        return
    }
    getUser(username, function(userObj) {
        var salt = userObj[0].salt;
        var hash = getHash(password, salt);
        if (!userObj || userObj[0].hash != hash) {
            res.sendStatus(401)
            return
        }
        var original = {
            username: user
        }
        var update = {
            username: username
        }
        updateAuth(original, update, function(items) {
            var sid = req.cookies[_cookieKey]

            _sessionUser[sid][0].username = username;
            var msg = {
                username: username,
                result: 'success'
            };
            res.send(msg);
        })
    })

}
/*
   this function is used to unlink the user with the facebook
 */
function unlinkAccount(req, res) {
    var username = req.body.username
    var password = req.body.password

    if (!username || !password) {
        res.sendStatus(400)
        return
    }
    getUser(username, function(userObj) {
        var salt = userObj[0].salt;
        var hash = getHash(password, salt);
        if (!userObj || userObj[0].hash != hash) {
            res.sendStatus(401)
            return
        }
        getAuth(req.user.displayName, function(items) {
            if (items[0].username == username) {
                var original = {
                    username: items[0].username
                }
                var update = {
                    username: req.user.displayName
                }
                updateAuth(original, update, function(items) {
                    var sid = req.cookies[_cookieKey]
                    _sessionUser[sid][0].username = req.user.displayName
                    var msg = {
                        username: username,
                        result: 'success'
                    };
                    res.send(msg);

                })

            } else {
                res.sendStatus(400)
                return
            }
        })
    })

}

passport.serializeUser(function(user, done) {
    users[user.id] = user
    done(null, user.id)

})
passport.deserializeUser(function(id, done) {
    var user = users[id]
    done(null, user)
})

passport.use(new FacebookStrategy(config,
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile)
        })
    }));

/*
   this function is used to check whether user is logged in normal way or third party
 */
function checkAccount(req, res) {
    var sid = req.cookies[_cookieKey]
    if (!sid) {
        return res.sendStatus(401)
    }
    var facebook = _sessionUser[sid][0].facebook
    var username = _sessionUser[sid][0].username
    if (facebook == undefined) {
        res.send({
            check: 'no',
            username: username
        })
    } else {
        res.send({
            check: 'yes',
            username: username
        })
    }
}
/*
    this function is used when the user wants to log in third party
    this function has two parts: first,when user logs in from login page
    second,when user logs in to link or unlink
 */
function profile(req, res) {
    var sid = req.cookies[_cookieKey]
    if (_sessionUser[sid] == undefined) {
        var check = true;
        var facebook = req.user.displayName;
        getAuth(facebook, function(items) {
            if (items[0] == null) {
                new auth({
                    username: facebook,
                    facebook: facebook
                }).save(function(err, auth) {
                    new Profile({
                        username: facebook,
                        status: null,
                        following: [],
                        email: null,
                        zipcode: null,
                        picture: 'http://res.cloudinary.com/hrjyc1w7u/image/upload/v1461971478/1461971478040.jpg'
                    }).save(function(err, Profile) {
                        getAuth(facebook, function(item) {
                            var sessionkey = md5(new Date().getTime() + item.facebook);
                            redis.set(sessionkey, item[0])
                            redis.get(sessionkey, function(err, userObj) {
                                console.log(sessionkey + 'mapped to', userObj)
                            })
                            _sessionUser[sessionkey] = item;
                            res.cookie(_cookieKey, sessionkey, {
                                maxAge: 3600 * 1000,
                                http: true
                            });
                            res.redirect('https://zhyfrontendapp.herokuapp.com/#/main')
                        })
                    });
                });
            } else {
                var sessionkey = md5(new Date().getTime() + items.fackbook);
                redis.set(sessionkey, items[0])
                redis.get(sessionkey, function(err, userObj) {
                    console.log(sessionkey + 'mapped to', userObj)
                })

                _sessionUser[sessionkey] = items;
                res.cookie(_cookieKey, sessionkey, {
                    maxAge: 3600 * 1000,
                    http: true
                });
                res.redirect('http://zhyfrontendapp.herokuapp.com/#/main')
            }
        })
    } else {
        var displayName = req.user.displayName
        var sid = req.cookies[_cookieKey]
        username = _sessionUser[sid][0].username
        getAuth(displayName, function(items) {
            if (items[0].username == username) {
                var original = {
                    username: items[0].username
                }
                var update = {
                    username: displayName
                }
                updateAuth(original, update, function(items) {
                    res.redirect('http://zhyfrontendapp.herokuapp.com/#/main')

                })
                return
            }
            if (items[0].username == displayName) {
                var original = {
                    username: displayName
                }
                var update = {
                    username: username
                }
                updateAuth(original, update, function(items) {
                    res.redirect('http://zhyfrontendapp.herokuapp.com/#/main')

                })
                return
            } else {
                res.send('<h2>This operation fails,click here,redirect to the main page</h2>' + '<p><a href="https://zhyfrontendapp.herokuapp.com/#/main">Click here</a></p>')
            }
        })
    }
}

function fail(req, res) {
    res.redirect('http://zhyfrontendapp.herokuapp.com/#/login')

}

var _sessionUser = {};
var _cookieKey = 'sid';
/**
 * @param  salt [is generated by username and timestamp]
 * @param  hash [using salt to make password complicated]
 * detected by hackers
 * if username has already exsited,then can not register
 */
function register(req, res) {
    var password = req.body.password;
    var username = req.body.username;
    getUser(username, function(item) {
        if (item.length != 0) {
            res.send({
                result: 'fail',
                username: username
            })
        } else {
            var email = req.body.email;
            var zipcode = req.body.zipcode;
            var salt = username + new Date().getTime();
            var hash = getHash(password, salt);
            new User({
                username: username,
                salt: salt,
                hash: hash
            }).save();
            new Profile({
                username: username,
                status: null,
                following: [],
                email: email,
                zipcode: zipcode,
                picture: 'http://res.cloudinary.com/hrjyc1w7u/image/upload/v1461971478/1461971478040.jpg'
            }).save();
            res.send({
                result: 'success',
                username: username
            });
        }
    })

}
/**
 * check whether user  have right to login
 * when login, send a cookie to the browser
 */
function login(req, res) {
    var password = req.body.password;
    var username = req.body.username;
    if (!username || !password) {
        res.sendStatus(400)
        return
    }
    getUser(username, function(userObj) {
        if (userObj[0] == undefined) {
            res.sendStatus(401)
            return
        } else {
            var salt = userObj[0].salt;
            var hash = getHash(password, salt);
            if (userObj[0].hash != hash) {
                res.sendStatus(401)
                return
            }

            var sessionkey = md5(new Date().getTime() + userObj.username);
            redis.set(sessionkey, userObj[0])
            redis.get(sessionkey, function(err, userObj) {
                console.log(sessionkey + 'mapped to', userObj)
            })
            _sessionUser[sessionkey] = userObj;
            res.cookie(_cookieKey, sessionkey, {
                maxAge: 3600 * 1000,
                http: true
            });
            var msg = {
                username: username,
                result: 'success'
            };
            res.send(msg);
        }
    })
}
/**
 * already check whether user have authorized
 * clear the cookie
 */
function logout(req, res) {
    var sid = req.cookies[_cookieKey];
    if (!sid) {
        return res.sendStatus(401)
    }
    _sessionUser[sid] = [];
    res.clearCookie(_cookieKey);
    res.send('OK')
}
/**
 * @param  salt to hash password
 * @return the result of hash
 */
function getHash(password, salt) {
    return md5(password + salt)
}
/**
 * get user information from the database
 */
function getUser(username, callback) {
    User.find({
        username: username
    }).exec(function(err, items) {
        callback(items)
    })
}

function getAuth(username, callback) {
    auth.find({
        facebook: username
    }).exec(function(err, items) {
        callback(items)
    })
}

function updateAuth(original, update, callback) {
    auth.update(original, update).exec(function afterwards(err, items) {
        callback(items)
    })
}

function getAuth_(username, callback) {
    auth.find({
        username: username
    }).exec(function(err, items) {
        callback(items)
    })
}