const User = require('../models/user')
const Bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')
const config = require('../config')
const { token } = require('morgan')

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret)
}

exports.signup = function(req, res, next) {
    
    const email = req.body.email;
    const password = req.body.password;

    if (!email  || !password) {
        return res.status(422).send({ error: 'Email and Password required' })
    }

    User.findOne({ email: email }, function(err, existingUser) {
        if (err) {
            return next(err)
        }
        if (existingUser) {
            return res.status(422).send({ error: 'Email already in use'});
        }
    })

    // If a user doesn't exist, create and save user record.

    const user = new User({ email: email, password: password});
    user.save(function(err) {
        if (err) {
            return next(err)
        }
        // Respond to request
        res.json(({ token: tokenForUser(user) }))
    })
    
}

exports.signin = function(req, res, next) {
    console.log("USER: ", req.user)

    res.send({ token: tokenForUser(req.user)})
}