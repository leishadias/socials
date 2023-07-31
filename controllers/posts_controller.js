const Post = require('../models/post');
const Comment = require('../models/comments');

module.exports.create = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }).then((post)=>{
        return res.redirect('back');
    }).catch((err)=>{
        console.log('error in creating post');
        return;
    });
};

module.exports.destroy = async function(req, res){
    try {
        const currpost = await Post.findById(req.params.id);
        if (!currpost) {
          console.log('Post not found while creating comment');
          return; //res.status(404).send('Post not found');
        }

        if (currpost.user.toString() == req.user.id){
            await Post.deleteOne({ _id: req.params.id }); //await currpost.remove();
            await Comment.deleteMany({post: req.params.id}).then(()=>{
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
        
      } catch (err) {
        console.log('Error in deleting post', err);
        return; 
      }
};