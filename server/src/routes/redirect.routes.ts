import DELETE_USER_ACCOUNT from "../controller/redirect/delete-user-request.controller";
import FORGET_PASSWORD from "../controller/redirect/forget-password";
import NEW_USER from "../controller/redirect/new-user";
import VERIFY_TOKEN from "../controller/redirect/verify-access-token.controller";
import { Router } from "express";

const REDIRECT_ROUTER = Router();

// @ts-ignore
REDIRECT_ROUTER.post("/new-user", NEW_USER);

// @ts-ignore
REDIRECT_ROUTER.get('/forget-password', FORGET_PASSWORD);

// @ts-ignore
REDIRECT_ROUTER.delete("/delete-user", DELETE_USER_ACCOUNT);

// @ts-ignore
REDIRECT_ROUTER.get("/verify-token", VERIFY_TOKEN);


export default REDIRECT_ROUTER;
