import { Response, NextFunction } from 'express'
import { RequestType, TOKEN } from '../types/index.types';
import { GET_AUTH_SESSION } from '../utils/handle-auth-session';

const AUTH_MIDDLEWARE = async (req: RequestType, res: Response, next: NextFunction) => {

    const AUTH_SESSION = req.headers['auth-session'];
    if (!AUTH_SESSION || typeof (AUTH_SESSION) !== 'string') {
        return res.status(400).send({ msg: "Auth session missing", code: "ERR_HEADER_NOT_FOUND" })
    }
    try {
        const token: TOKEN = await GET_AUTH_SESSION(AUTH_SESSION);
        if (!token.EMAIL || !token.SESSION_TYPE) {
            return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
        }
        req.auth_email = token.EMAIL;
        req.session_type = token.SESSION_TYPE;
        return next()
    }
    catch (err: any) {
        if (err.message === 'ERR_REDIS_CONNECTION') {
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" })
        }
        else if (err.message === 'INVALID_TOKEN') {
            return res.status(408).send({ msg: "Request Timeout", code: "ERR_REQUEST_TIMEOUT" })
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }

}

export default AUTH_MIDDLEWARE;