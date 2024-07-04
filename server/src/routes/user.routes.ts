import { Router } from "express";
import CREATE_USER from "../controller/users/create-user.controller";
import DELETE_USER from "../controller/users/delete-user.controller";
import GET_USER_PROFILE from "../controller/users/get-user-profile.controller";
import SEARCH_USERS from "../controller/users/search-user.controller";
import UPDATE_USER from "../controller/users/update-user.controller";
import LOGOUT from "../controller/users/logout.controller";
import AUTH_MIDDLEWARE from "../middlewares/auth.middleware";
import USER_MIDDLEWARE from "../middlewares/user.middleware";

const USER_ROUTER = Router();

// @ts-ignore
USER_ROUTER.get("/search-user", SEARCH_USERS);
// @ts-ignore
USER_ROUTER.get("/get-user-profile", USER_MIDDLEWARE, GET_USER_PROFILE);
// @ts-ignore
USER_ROUTER.post("/create-user", CREATE_USER);
// @ts-ignore
USER_ROUTER.patch("/update-user", USER_MIDDLEWARE, UPDATE_USER);
// @ts-ignore
USER_ROUTER.delete("/delete-user", AUTH_MIDDLEWARE, DELETE_USER);
// @ts-ignore 
USER_ROUTER.delete("/logout", LOGOUT)

export default USER_ROUTER;