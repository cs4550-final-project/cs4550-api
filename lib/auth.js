// require authentication related packages
const passport = require("passport");
const bearer = require("passport-http-bearer");

// user model will be used to set `req.user` in
// authenticated routes
const User = require("../app/models/user");

const strategy = new bearer.Strategy(function (token, done) {
  User.findOne({ token: token }, function (err, user) {
    if (err) {
      return done(err);
    }
    return done(null, user, { scope: "all" });
  });
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(strategy);

module.exports = passport.initialize();
