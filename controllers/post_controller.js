module.exports.post = function(req, res){
    // return res.end("text-post");
    return res.render('post', {
        title:"post"
    });
};