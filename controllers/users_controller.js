const User = require('../models/user');

module.exports.signup = function(req, res){
    return res.render('user_sign_up', {
        title:"sign up"
    });
};

module.exports.signin = function(req, res){
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