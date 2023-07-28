const passport = require('passport');
const User = require('../models/user');
const LocalStratergy = require('passport-local').Strategy;

passport.use(new LocalStratergy({
    usernameField: 'email'
    },
    function(email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) { 
            console.log('error in finding user');
            return done(err); 
        }
        if (!user) { 
            console.log('user not found');
            return done(null, false); 
        }
        if (!user.verifyPassword(password)) { 
            console.log('wrong password');
            return done(null, false); 
        }
        return done(null, user);
      });
    }
  ));

  //serialised
  passport.serializeUser(function(user,done){
    done(null, user.id);
  });

  //deserialze
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if (err){
            console.log('couldnt find user - deserialized');
            return done(err);
        }
        return done(null, user);
    });
  });

  module.exports=passport;
  