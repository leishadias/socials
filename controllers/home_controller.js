const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
        let users = await User.find({});
        return res.render('home', {
            title:"home",
            postlist: posts,
            all_users: users
            });
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};