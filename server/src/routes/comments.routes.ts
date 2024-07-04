import { Router } from "express";

import GET_COMMENTS from "../controller/comments/get-comment.controller";
import UPDATE_COMMENT from "../controller/comments/update-comment.controller";
import REMOVE_COMMENT from "../controller/comments/remove-comment.controller";
import ADD_COMMENT from "../controller/comments/add-comment.controller";
import COMMENT_MIDDLEWARE from "../middlewares/comment.middleware";

const COMMENT_ROUTER = Router();

// @ts-ignore
COMMENT_ROUTER.get("/get-comments", GET_COMMENTS);

// @ts-ignore
COMMENT_ROUTER.patch("/update-comment", COMMENT_MIDDLEWARE, UPDATE_COMMENT);

// @ts-ignore
COMMENT_ROUTER.delete("/remove-comment", COMMENT_MIDDLEWARE, REMOVE_COMMENT);

// @ts-ignore
COMMENT_ROUTER.post("/add-comment", ADD_COMMENT);



export default COMMENT_ROUTER;