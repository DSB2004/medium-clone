import { Response, NextFunction } from "express"
import { RequestType } from "../types/index.types"
import { GET_ACCESS_SESSION } from "../utils/handle-access-session";
import { DECODE_TOKEN } from "../utils/handle-jwt";
const TOKEN_MIDDLEWARE = async (req: RequestType, res: Response, next: NextFunction) => {
    const token = req.headers['access-token'];
    const session = req.headers['session'];

    try {
        if (!token || !session || typeof (token) !== 'string') {
            return res.status(400).send({ msg: "Headers missing", code: "ERR_HEADER_NOT_FOUND" });
        }
        const USER_DATA = await DECODE_TOKEN(token);
        const get_session = await GET_ACCESS_SESSION(USER_DATA.EMAIL);
        if (get_session === session) {
            req.user_email = USER_DATA.EMAIL;
            return next();
        }
        else {

            return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
        }
    }
    catch (err: any) {
        if (err.message === 'ERR_REDIS_CONNECTION') {
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === 'INVALID_TOKEN') {
            return res.status(403).send({ msg: "Token has expired", code: "ERR_INVALID_TOKEN" });
        }
        else if (err.message === 'ERR_SESSION_NOT_FOUND') {
            return res.status(403).send({ msg: "Session has expired", code: "ERR_INVALID_SESSION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" });
        }
    }


}

export default TOKEN_MIDDLEWARE;