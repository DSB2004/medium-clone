import { Request, Response } from "express";
import passport from 'passport';
import { CREATE_TOKEN } from "../../utils/handle-jwt";
import { USER_LOGIN } from "../../utils/handle-user"; // If you use this, make sure it is used correctly

const GOOGLE_SIGNIN_AUTHORISE = (req: Request, res: Response, next: Function) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.redirect('/failure');
        }

        if (user) {
            const token_data = {
                NAME: user.displayName,
                EMAIL: user.emails[0].value
            };

            const token = CREATE_TOKEN(token_data, '1w');

            // Get return URL from query parameters


            // Generate JWT and redirect to frontend with the token
            return res.redirect(`/success?token=${token}`);
        }
    })(req, res, next);
};


export default GOOGLE_SIGNIN_AUTHORISE;
