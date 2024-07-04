import { RequestType } from "../types/index.types";
import { Response, NextFunction } from "express";
import { CHECK_BLOG_OWNERSHIP } from "../utils/handle-blog-ownership";
import { CHECK_COMMENT_OWNERSHIP } from "../utils/handle-comment-ownership";

const COMMENT_MIDDLEWARE = async (req: RequestType, res: Response, next: NextFunction) => {
    const token_email = req.user_email;
    const req_blog = req.headers['req-blog'];
    const req_comment = req.headers['req-comment'];

    console.log(req_blog, req_comment, token_email)
    if (!token_email) {
        console.log(token_email)
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    if (!req_blog || typeof (req_blog) !== 'string' || !req_comment || typeof (req_comment) !== 'string') {
        return res.status(400).send({ msg: "Request headers missing", code: "ERR_HEADER_NOT_FOUND" })
    }
    req.req_blog = req_blog;

    const blogowner = await CHECK_BLOG_OWNERSHIP(token_email, req_blog);
    const commentowner = await CHECK_COMMENT_OWNERSHIP(token_email, req_comment)

    if ((req.method === 'GET') || (blogowner === true && req.method === 'DELETE') || (commentowner === true && req.method === 'DELETE' || 'PATCH')) {
        return next();
    }
    else {
        return res.status(403).send({ msg: "Access Denied", code: "ERR_ACCESS_DENIED" });
    }
}

// console.log("token not valid")

export default COMMENT_MIDDLEWARE;