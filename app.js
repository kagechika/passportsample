var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/users');

//
// setting passport
var passport = require("passport"),
    twStrategy = require("passport-twitter").Strategy;

//
// use passport
// 
passport.use(new twStrategy({
        consumerKey: "xUUgA2PeFR1mEJB98OdQgKULD",
        consumerSecret: "iu6HUO20an46qV55diQtlvyj6mOfWIIqVoI11KAGyWaqzzrZ49",
        callbackURL: "http://ec2-54-64-244-21.ap-northeast-1.compute.amazonaws.com:50000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, done){
        profile.twitter_token = token;
        profile.twitter_token_secret = tokenSecret;
        
        process.nextTick(function(){
            return done(null, profile);
        });
    }
));


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 50000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({secret:"keyboard cat", saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

//
// passport session setup
//
passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

//
// routing
//
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/users', users.list);
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/twitter/callback", 
    passport.authenticate("twitter", {
        successRedirect: "/users",
        failureRedirect: "/login"
    }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
