import { RequestType } from "../types/index.types";
import { Response, NextFunction } from "express";
import { CHECK_BLOG_OWNERSHIP } from "../utils/handle-blog-ownership";

const BLOG_MIDDLEWARE = async (req: RequestType, res: Response, next: NextFunction) => {
    const token_email = req.user_email;
    if (!token_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    const req_blog = req.headers['req-blog'];
    if (!req_blog || typeof (req_blog) !== 'string') {
        return res.status(400).send({ msg: "Request blog id  missing", code: "ERR_HEADER_NOT_FOUND" })
    }
    req.req_blog = req_blog;

    const ownershipCheck = await CHECK_BLOG_OWNERSHIP(token_email, req_blog);
    req.allowBlogAccess = ownershipCheck;

    if (ownershipCheck === true || req.method === 'GET') {
        return next();
    }
    else {
        return res.status(403).send({ msg: "Access Denied", code: "ERR_ACCESS_DENIED" });
    }
}


export default BLOG_MIDDLEWARE;