const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = async function(req, res){
    try{
        let user = await User.findById(req.params.id);
        return res.render('profile', {
            title:"profile",
            profile_user: user
        });
    }catch(err){
        req.flash('error', err);//console.log('error in loading profile', err);
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
    req.flash('success', 'log in success');
    return res.redirect('/');
};

module.exports.create = async function(req, res){
    try{
        if (req.body.password != req.body.confirmPassword){
            req.flash('error', 'Confirmation password incorrect');
            return res.redirect('back');
        }
        let user = await User.findOne({email: req.body.email});
        if (!user){
            await User.create(req.body);
            req.flash('success', 'Account created successfully');
            return res.redirect('/users/signin');
        }else{
            req.flash('error', 'Account already exists');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.destroySession=function(req, res){
    try{
        req.logout(function(err) {
            if (err) { return next(err); }
            req.flash('success', 'log out success');
            return res.redirect('/');
          });
    }catch(err){
        req.flash('error', err); //console.log('error', err);
        return res.redirect('back');
    }
}

module.exports.update=async function(req,res){
    try{
        // if (req.user.id==req.params.id){
        //     await User.findByIdAndUpdate(req.params.id, req.body);
        //     req.flash('success', 'Details updated successfully');
        //     return res.redirect('back');
        // }else{
        //     return res.status(401).send('Unauthorised');
        // }
        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req,res,function(err){
            if (err){
                console.log("error in multer", err);
                return;
            }
            if (req.user.id==req.params.id){
                user.name=req.body.name;
                user.email=req.body.email;

                if(req.file){
                    if (user.avatar){
                        fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                    }
                    user.avatar=path.join(User.avatarPath, req.file.filename);
                }
                user.save();
                return res.redirect('back');
            }else{
                return res.status(401).send('Unauthorised');
            }
        });
    }catch(err){
        req.flash('error', err); //console.log('error', err);
        return res.redirect('back');
    }
}
