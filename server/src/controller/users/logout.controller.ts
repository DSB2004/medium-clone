import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { REMOVE_ACCESS_SESSION } from "../../utils/handle-access-session";
import { USER_LOGOUT } from "../../utils/handle-user";

const LOGOUT = async (req: RequestType, res: Response) => {

    const user_email = req.user_email;

    if (!user_email || typeof (user_email) !== 'string') {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    try {
        await REMOVE_ACCESS_SESSION(user_email);
        await USER_LOGOUT(user_email);
        res.send({ msg: `Redirect user to /` });
    }
    catch (err: any) {
        if (err.message === 'ERR_REDIS_CONNECTION') {
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" })
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }
}

export default LOGOUT;