const Comments = require('../models/comments');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
// const commentsEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (!post) {
      req.flash('error', 'Post not found while creating comment'); //console.log('Post not found while creating comment');
      return res.redirect('back');
    }
    let comment = await Comments.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post,
    });

    post.comments.push(comment);
    await post.save();
    await comment.populate('user', 'name email');
    commentsMailer.newComment(comment);
    // let job=queueMicrotask.create('emails',comment).save(function(err){
    //   if (err){

    //   }
    //   console.log(job.id);
    // });
    if(req.xhr){
      return res.status(200).json({
          data: {
            comment: comment
          },
          message: "comment created"
      });
    }
    req.flash('success', 'Comment updated successfully');
    return res.redirect('/');
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function(req, res){
  try{
    let comment = await Comments.findById(req.params.id);
    if (comment.user.toString() == req.user.id){
      let postId = comment.post;
      await Comments.deleteOne({ _id: req.params.id });
      await Post.findByIdAndUpdate(postId, {$pull:{comments:req.params.id}});
      if(req.xhr){
        return res.status(200).json({
            data: {
                comment_id: req.params.id
            },
            message: "comment deleted"
        });
      } 
      req.flash('success', 'Comment deleted successfully');
    } 
    return res.redirect('back');
  } catch(err){
    req.flash('error', err);
    return res.redirect('back');
  }
};