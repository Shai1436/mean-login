// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth       = require('./config');
// load up the user model
var User             = require('./models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

	passport.use('local-login', new LocalStrategy(
	  function(username, password, done) {
	    User.findOne({
	      username: username.toLowerCase()
	    }, function(err, user) {
	      // if there are any errors, return the error before anything else
           if (err)
               return done(err);

           // if no user is found, return the message
           if (!user)
               return done(null, false);

           // if the user is found but the password is wrong
           if (!user.validPassword(password))
               return done(null, false);

           // all is well, return successful user
           return done(null, user);
	    });
	  }
	));

  // Facebook strategy
  passport.use(new FacebookStrategy({

     // pull in our app id and secret from our auth.js file
     clientID        : configAuth.facebookAuth.clientID,
     clientSecret    : configAuth.facebookAuth.clientSecret,
     callbackURL     : configAuth.facebookAuth.callbackURL,
     profileFields : ['id', 'displayName', 'email']

  },

  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
     // asynchronous
     process.nextTick(function() {

         // find the user in the database based on their facebook id
         User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

             // if there is an error, stop everything and return that
             // ie an error connecting to the database
             if (err)
                 return done(err);

             // if the user is found, then log them in
             if (user) {
                 return done(null, user); // user found, return that user
             } else {
                 // if there is no user found with that facebook id, create them
                 var newUser  = new User();

                 // set all of the facebook information in our user model
                 newUser.facebook.id    = profile.id; // set the users facebook id
                 newUser.facebook.token = token; // we will save the token that facebook provides to the user
                 newUser.facebook.name  = profile.displayName; // look at the passport user profile to see how names are returned
                 if(profile.emails){
                    newUser.email = profile.emails[0].value;
                    //console.log("email", newUser.email);
                 }

                 // save our user to the database
                 newUser.save(function(err) {
                     if (err)
                         throw err;

                     // if successful, return the new user
                     return done(null, newUser);
                 });
             }

         });
     });

  }));

  passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        profileFields   : ['id', 'displayName', 'email']

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new User();
                    console.log("profile", profile);
                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    //newUser.google.email = profile.emails[0].value; // pull the first email
                    newUser.email = profile.emails[0].value
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

  }));
};
