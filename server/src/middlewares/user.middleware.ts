import { RequestType } from "../types/index.types";
import { Response, NextFunction } from "express";

const USER_MIDDLEWARE = (req: RequestType, res: Response, next: NextFunction) => {
    const token_email = req.user_email;
    if (!token_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    const alias_email = req.headers['alias-email'];
    if (!alias_email || typeof (alias_email) !== 'string') {
        return res.status(400).send({ msg: "Alias email missing", code: "ERR_HEADER_NOT_FOUND" })
    }
    
    req.alias_email = alias_email;
    
    if (alias_email === token_email) {
        req.allowAccountAccess = true;
        return next();
    }
    else if (req.method === 'GET') {
        req.allowAccountAccess = false;
        return next();
    }
    else {
        return res.status(403).send({ msg: "Access Denied", code: "ERR_ACCESS_DENIED" });
    }
}


export default USER_MIDDLEWARE;