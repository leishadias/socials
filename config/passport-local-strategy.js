const passport = require('passport');
const User = require('../models/user');
const LocalStratergy = require('passport-local').Strategy;

passport.use(new LocalStratergy({
    usernameField: 'email'
    },
    function(email, password, done) {
      User.findOne({ email: email }).then(
        function (user) {
          if (!user || user.password!=password) { 
              console.log('user not found');
              return done(null, false); 
          }
          return done(null, user);
        }
      ).catch((err)=>{
        console.log('error in finding user');
        return done(err); 
      });
    }
  ));

  //serialised
  passport.serializeUser(function(user,done){
    done(null, user.id);
  });

  //deserialze
  passport.deserializeUser(function(id, done){
    User.findById(id).then(
      function(user){
        return done(null, user);
    }
    ).catch(
      (err)=>{
        console.log('couldnt find user - deserialized');
        return done(err);
      });
  });

  passport.checkAuthentication= function(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    return res.redirect('/users/signin');
  }

  passport.setAuthenticatedUser= function(req,res,next){
    if(req.isAuthenticated()){
      res.locals.user = req.user;
    }
    next();
  }

  module.exports=passport;
  