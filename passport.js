const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('./db').Users

//storing the user in session
//serialuser defines how to store users in a session, we send the username in done value 
passport.serializeUser(function (user, done) {
    done(null, user.username)
})

//tells how to recover the actual user object, we get a username and recreate a user object
passport.deserializeUser(function (username, done) {
    Users.findOne({
        username: username
    }).then((user) => {
        if (!user) {
            return done(new Error("No such user"))
        }
        return done(null, user)
    }).catch((err) => {
        done(err)
    })
})

passport.use(new LocalStrategy(function (username, password, done) {
    Users.findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if (!user) {
            return done(null, false, {message: "No such user"})
        }
        if (user.password !== password) {
            return done(null, false, {message: "Wrong password"})
        }
        return done(null, user)
    }).catch((err) => {
        return done(err)
    })
}))

exports = module.exports = passport