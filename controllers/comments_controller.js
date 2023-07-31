const Comments = require('../models/comments');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (!post) {
      console.log('Post not found while creating comment');
      return; 
    }
    let comment = await Comments.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post,
    });

    post.comments.push(comment);
    await post.save();

    return res.redirect('/');
  } catch (err) {
    console.log('Error in creating comment', err);
    return; 
  }
};

module.exports.destroy = async function(req, res){
  try{
    let comment = await Comments.findById(req.params.id);
    if (comment.user.toString() == req.user.id){
      let postId = comment.post;
      await Comments.deleteOne({ _id: req.params.id });
      await Post.findByIdAndUpdate(postId, {$pull:{comments:req.params.id}});
    }
    return res.redirect('back');
  } catch(err){
    console.log('Error in delting comments', err);
    return; 
  }
};