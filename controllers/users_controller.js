module.exports.profile = function(req, res){
    // return res.end("text-profile");
    return res.render('users', {
        title:"users"
    });
};