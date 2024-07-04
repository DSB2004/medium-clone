import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../env"
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: `/auth/v1/googleauth/callback`,
    scope: ['profile', 'email']
},
    function (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
        try {
            // Handle profile data and generate JWT if needed
            return done(null, profile);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;

