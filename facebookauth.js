const passport = require("passport")
const facebookStrategy = require('passport-facebook').Strategy
require('dotenv').config();
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(fbuser, done) {
    done(null,user)
});
passport.use(new facebookStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : process.env.FB_CLIENT_ID,
    clientSecret    : process.env.FB_CLIENT_SECRET,
    callbackURL     : process.env.FB_CALLBACK_URL,
    profileFields   : ['id','displayName','name','gender','picture.type(large)','email','hometown']

},// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

//  console.log(profile)

    return done(null,profile)
}));
