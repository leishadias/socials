module.exports.home = function(req, res){
    // return res.end("text-abc");
    console.log(req.cookies);
    res.cookie('username',25);
    return res.render('home', {
        title:"home"
    });
};