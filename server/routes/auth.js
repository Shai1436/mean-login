var express = require('express');
//var router = express.Router();
var passport = require('../passport');
var User = require('../models/user');
var Verify    = require('../verify');

module.exports = function(app, passport) {
  // app.get('/', function(req, res, next) {
  //     User.find({}, function(err, user) {
  //         if (err) throw err;
  //         res.json(user);
  //     });
  //
  //     //res.send('respond with a resource');
  // });

  app.post('/auth/register', function(req, res) {
      User.register(new User({ username : req.body.username }),
          req.body.password, function(err, user) {
          if (err) {
              return res.status(500).json({err: err});
          }
          if(req.body.firstname) {
              user.firstname = req.body.firstname;
          }
          if(req.body.lastname) {
              user.lastname = req.body.lastname;
          }
          user.save(function(err,user) {
              passport.authenticate('local')(req, res, function () {
                  return res.status(200).json({status: 'Registration Successful!'});
              });
          });
      });
  });

  app.post('/auth/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: 'Could not log in user'
          });
        }

        var token = Verify.getToken(user);
                res.status(200).json({
          status: 'Login successful!',
          success: true,
          token: token
        });
      });
    })(req,res,next);
  });

  // loggedin 'post' to send credentials
  app.get("/auth/loggedin", function(req, res) {

    require('../config').currentUser = req.user.email;
    res.send(req.isAuthenticated() ? req.user : '0');
    //res.send(req.user);
  });

  app.get('/auth/logout', function(req, res) {
      req.logout();
    res.status(200).json({
      status: 'Bye!'
    });
  });

  // Facebook auth routes
  app.get('/auth/facebook', function authenticateFacebook (req, res, next) {
    //console.log("Inside callback", req.session);
    req.session.returnTo = 'http://localhost:9000/#' + req.query.returnTo;
    next ();
  },
  passport.authenticate ('facebook', {session: true, scope : ['email']}));

  app.get('/auth/facebook/callback',function (req, res, next) {
     //console.log("user", req.user);

      var authenticator = passport.authenticate ('facebook', {
         successRedirect: req.session.returnTo,
         failureRedirect: 'http://localhost:9000/',
         session: true
      });

      delete req.session.returnTo;
      authenticator (req, res, next);
  });

  app.get('/auth/google', function authenticateGoogle (req, res, next) {
    //console.log("Inside callback", req.session);
    req.session.returnTo = 'http://localhost:9000/#' + req.query.returnTo;
    next ();
  },
  passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/auth/google/callback',function (req, res, next) {
     //console.log("user", req.user);

      var authenticator = passport.authenticate ('google', {
         successRedirect: req.session.returnTo,
         failureRedirect: 'http://localhost:9000/',
         session: true
      });

      delete req.session.returnTo;
      authenticator (req, res, next);
  });
}
