const Post = require('../models/post');
const Comment = require('../models/comments');

module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        req.flash('success', 'Post created successfully');
        return res.redirect('back');
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (!currpost) {
            req.flash('error', 'Post not found');
          return res.redirect('back');
        }
        if (currpost.user.toString() == req.user.id){
            await Post.deleteOne({ _id: req.params.id }); 
            await Comment.deleteMany({post: req.params.id});  
            req.flash('success', 'Post deleted successfully');
        }
        return res.redirect('back');
      } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
      }
};