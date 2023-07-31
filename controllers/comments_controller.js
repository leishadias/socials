const Comments = require('../models/comments');
const Post = require('../models/post');


// module.exports.create = function(req, res){
//     Post.findById(req.body.post).then((post)=>{
//         if (post){
//             Comments.create({
//                 content: req.body.content,
//                 user: req.user._id,
//                 post: req.body.post
//             }).then((comment)=>{
//                 Post.comments.push(comment);
//                 Post.save();
//                 return res.redirect('/');
//             }).catch((err)=>{
//                 console.log('error in creating comment', err);
//                 return; 
//             });
//         }
//     }
//     ).catch(()=>{
//         console.log('error in finding post while creating comment');
//         return;
//     });
    
// };


module.exports.create = async function (req, res) {
  try {
    const post = await Post.findById(req.body.post);
    if (!post) {
      console.log('Post not found while creating comment');
      return; //res.status(404).send('Post not found');
    }

    const comment = await Comments.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post,
    });

    // Assuming Post.comments is an array field in the Post model
    post.comments.push(comment);
    await post.save();

    return res.redirect('/');
  } catch (err) {
    console.log('Error in creating comment', err);
    return; // res.status(500).send('Internal server error');
  }
};
