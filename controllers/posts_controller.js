const Post = require('../models/post');
const Comment = require('../models/comments');

module.exports.create = async function(req, res){
    try{
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    }catch(err){
        console.log('error in creating post', err);
        return;
    }
};

module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (!currpost) {
          console.log('Post not found while creating comment');
          return;
        }
        if (currpost.user.toString() == req.user.id){
            await Post.deleteOne({ _id: req.params.id }); 
            await Comment.deleteMany({post: req.params.id});  
        }
        return res.redirect('back');
      } catch (err) {
        console.log('Error in deleting post', err);
        return; 
      }
};