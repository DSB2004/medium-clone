import { DECODE_TOKEN } from "../../utils/handle-jwt";
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { SET_ACCESS_SESSION } from "../../utils/handle-access-session";
import { CHECK_USER_LOGIN, CHECK_USER_ACCOUNT } from "../../utils/handle-user";


const VERIFY_TOKEN = async (req: RequestType, res: Response) => {
    const access_token = req.headers['access-token'];
    try {
        if (!access_token || typeof (access_token) !== 'string') {
            return res.status(400).send({ msg: "Token is required", errCode: "ERR_HEADER_NOT_FOUND" });
        }
        const USER_DATA = await DECODE_TOKEN(access_token);
        if (USER_DATA.TOKEN_ID) {
            const login_status = await CHECK_USER_LOGIN(USER_DATA.EMAIL, USER_DATA.TOKEN_ID);
            if (login_status) {
                const session = await SET_ACCESS_SESSION(USER_DATA.EMAIL);
                const account_exist = await CHECK_USER_ACCOUNT(USER_DATA.EMAIL);
                return res.send({ msg: `Redirecting user to /dashboard?session=${session}`, session, account_exist: account_exist, user: { NAME: USER_DATA.NAME, EMAIL: USER_DATA.EMAIL } });
            }
            else {
                return res.status(403).send({ msg: "User has logout", code: "ERR_INVALID_REQUEST" });
            }
        }

    }
    catch (err: any) {
        console.log(err)
        if (err.message === 'ERR_REDIS_CONNECTION') {
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" })
        }
        else if (err.message === 'INVALID_TOKEN') {
            res.status(403).send({ msg: "Token has expired", code: "ERR_INVALID_TOKEN" })
        }
        else {
            console.log(err)
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }
}

export default VERIFY_TOKEN;