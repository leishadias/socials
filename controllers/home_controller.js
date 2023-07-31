const Post = require('../models/post');

// module.exports.home = function(req, res){
//     Post.find({}).then((postlist)=>{
//         return res.render('home', {
//             title:"home",
//             postlist: postlist
//         });
//     }).catch(()=>{
//         console.log('couldnt fetch posts');
//     });
    
// };

module.exports.home = function(req, res){
    Post.find({}).populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec().then((posts)=>{
        return res.render('home', {
            title:"home",
            postlist: posts
            });
    }).catch(()=>{
        console.log('couldnt fetch posts');
    });
};