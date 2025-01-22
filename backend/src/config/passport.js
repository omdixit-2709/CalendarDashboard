const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        console.error('Deserialize User Error:', error);
        done(error, null);
    }
});

// Get callback URL from environment variable or use default
const GOOGLE_CALLBACK_URL = process.env.API_URL 
    ? `${process.env.API_URL}/auth/google/callback`
    : 'https://calendar-dashboard-backend.onrender.com/auth/google/callback';

console.log('Configured callback URL:', GOOGLE_CALLBACK_URL);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
    ]
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        console.log('Google OAuth Callback received:', { 
            profileId: profile.id,
            email: profile.emails[0].value,
            callbackURL: GOOGLE_CALLBACK_URL
        });

        // Find or create user
        const [user, created] = await User.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                accessToken,
                refreshToken
            }
        });

        // Update tokens if user exists
        if (!created) {
            user.accessToken = accessToken;
            if (refreshToken) {
                user.refreshToken = refreshToken;
            }
            await user.save();
            console.log('Updated existing user tokens');
        } else {
            console.log('Created new user');
        }

        return done(null, user);
    } catch (error) {
        console.error('Passport strategy error:', error);
        return done(error, null);
    }
}));

// Add error event handlers
passport.on('error', (err) => {
    console.error('Passport error:', err);
});

// Add strategy error handler
passport.on('strategy_error', (err) => {
    console.error('Strategy error:', err);
});

module.exports = passport;