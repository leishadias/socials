module.exports.home = function(req, res){
    // return res.end("text-abc");
    return res.render('home', {
        title:"home"
    });
};