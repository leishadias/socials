const User = require('../models/user');

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        return res.render('profile', {
            title:"profile",
            profile_user: user
        });
    }catch(err){
        console.log('error in loading profile', err);
        return;
    }
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

module.exports.create = async function(req, res){
    try{
        if (req.body.password != req.body.confirmPassword){
            return res.redirect('back');
        }
        let user = await User.findOne({email: req.body.email});
        if (!user){
            await User.create(req.body);
            return res.redirect('/users/signin');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('error in finding user', err);
        return;
    }
};

module.exports.destroySession=function(req, res){
    try{
        req.logout(function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
          });
    }catch(err){
        console.log('error', err);
        return;
    }
}

module.exports.update=async function(req,res){
    try{
        if (req.user.id==req.params.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
        }else{
            return res.status(401).send('Unauthorised');
        }
    }catch(err){
        console.log('error', err);
        return;
    }
}
