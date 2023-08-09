const passport = require('passport');
const JWTSrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts ={
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'
}

passport.use(new JWTSrategy(opts, function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id).then((user)=>{
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    }).catch((err)=>{
        console.log("err",err);
    });
}));

module.exports=passport;