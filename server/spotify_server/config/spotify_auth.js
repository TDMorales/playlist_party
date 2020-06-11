const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./keys')
const User = require('../../models/user-model')

//use Passport to authenticate user
passport.use(
    new SpotifyStrategy(
        {   
            clientID: keys.spotify.client_id,
            clientSecret: keys.spotify.client_secret,
            callbackURL: keys.spotify.redirect_uri
        },
         ( accessToken, refreshToken, profile, done ) => {
            //check if user exists
            User.findOne({ spotifyId: profile.id }).then((currentUser)=>{
                if(currentUser){
                    console.log('user is:' + currentUser)
                    done(null, currentUser);
                }else{
                    new User({
                        username: profile.displayName,
                        spotifyId: profile.id
                    }).save().then((newUser) => {
                        console.log('new user created:' + newUser)
                        done(null, newUser);
                    })
                }
            })
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user)=>{
    done(null, user);
    })
});

 

