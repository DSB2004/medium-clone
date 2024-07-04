import { Router } from "express";
import GOOGLE_SIGNIN from "../controller/google-auth/google.controller";
import GOOGLE_SIGNIN_AUTHORISE from "../controller/google-auth/google-authorise.controller";
import passport from "../utils/handle-google-auth";
const GOOGLE_ROUTER = Router();

GOOGLE_ROUTER.get("/", GOOGLE_SIGNIN);
GOOGLE_ROUTER.get("/authorise", passport.authenticate('google', { scope: ['profile', 'email'] }));
GOOGLE_ROUTER.get("/callback", GOOGLE_SIGNIN_AUTHORISE);

export default GOOGLE_ROUTER;