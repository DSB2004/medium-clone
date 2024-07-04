import { Router } from "express";
import VALIDATE_OTP from "../controller/auth/otp.controller";
import RESET_PASSWORD from "../controller/auth/password-reset";
import USER_SIGNIN from "../controller/auth/signin.controller";
import USER_SIGNUP from "../controller/auth/signup.controller";
import AUTH_MIDDLEWARE from "../middlewares/auth.middleware";

const AUTH_ROUTER = Router();

// @ts-ignore
AUTH_ROUTER.patch('/reset-password', AUTH_MIDDLEWARE, RESET_PASSWORD);
// @ts-ignore
AUTH_ROUTER.get('/validate-otp', VALIDATE_OTP);
// @ts-ignore
AUTH_ROUTER.post('/signin', USER_SIGNIN);
// @ts-ignore
AUTH_ROUTER.post('/signup', AUTH_MIDDLEWARE, USER_SIGNUP);

export default AUTH_ROUTER;