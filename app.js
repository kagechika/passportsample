//
// setting express
//
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


//
// setting passport
//
var passport = require('passport'),
    twStrategy = require('passport-twitter').Strategy;

passport.use(new twStrategy({
        consumerKey: "xUUgA2PeFR1mEJB98OdQgKULD",
        consumerSecret: "iu6HUO20an46qV55diQtlvyj6mOfWIIqVoI11KAGyWaqzzrZ49",
        callbackURL: "http://ec2-54-64-144-22.ap-northeast-1.compute.amazonaws.com/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done){
        User.findOrCreate({}, function(err, user){
        if(err){ return done(err); }
        done(null, user);
    });
    }
));

//
// routing
//
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/twitter/callback", passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

console.log("hello node");
