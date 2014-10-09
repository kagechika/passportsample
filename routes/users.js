//var express = require('express');
//var router = express.Router();

/* GET users listing. */
//router.get('/users', function(req, res) {
//  res.send('respond with a resource');
//});

//module.exports = router;
exports.list = function(req, res){
    res.render('users', { username:req.user.username, profile_image:req.user.photos[0].value });
};

