import GET_FOLLOWERS from "../controller/followers/get-followers.controller";
import GET_FOLLOWING from "../controller/followers/get-following.controller";
import ADD_FOLLOWING from "../controller/followers/add-following.controller";
import REMOVE_FOLLOWING from "../controller/followers/remove-following.controller";

import { Router } from "express";

import { Response, Request } from "supertest";
const FOLLOWER_ROUTER = Router();


// @ts-ignore
FOLLOWER_ROUTER.get('/', (req: Request, res: Response) => {

    // @ts-ignore
    res.send("Hello from followers");
});

// @ts-ignore
FOLLOWER_ROUTER.get('/get-followers', GET_FOLLOWERS);
// @ts-ignore
FOLLOWER_ROUTER.get('/get-followings', GET_FOLLOWING);
// @ts-ignore
FOLLOWER_ROUTER.put("/add-following", ADD_FOLLOWING);
// @ts-ignore
FOLLOWER_ROUTER.delete("/remove-following", REMOVE_FOLLOWING);

export default FOLLOWER_ROUTER;