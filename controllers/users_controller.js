const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id).then((user)=>{
        return res.render('profile', {
            title:"profile",
            profile_user: user
        });
    });
    
};

module.exports.signup = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title:"sign up"
    });
};

module.exports.signin = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title:"sign in"
    });
};


module.exports.createSession = function(req, res){
    return res.redirect('/');
};

module.exports.create = function(req, res){
    if (req.body.password != req.body.confirmPassword){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}).then((user)=>{
        if (!user){
            User.create(req.body).then(()=>{
                return res.redirect('/users/signin');
            }).catch(()=>{
                console.log('error in creating user');
            });
        }else{
            return res.redirect('back');
        }
    }).catch(()=>{
        console.log('error in finding user');
    });
};

module.exports.destroySession=function(req, res){
    req.logout(function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
}

module.exports.update=function(req,res){
    if (req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body).then(()=>{
            return res.redirect('back');
        });
    }else{
        return res.status(401).send('Unauthorised');
    }
}
