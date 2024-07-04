import { Request, Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { RequestType } from "../../types/index.types";
const SQL_QUERY = 'SELECT *, EXISTS ( SELECT 1  FROM FOLLOWERS  WHERE USER_EMAIL=?  AND FOLLOWER_EMAIL=?) AS FOLLOWED_BY_YOU, EXISTS ( SELECT 1  FROM FOLLOWERS  WHERE USER_EMAIL=? AND FOLLOWER_EMAIL=?)  AS FOLLOWING_YOU FROM USER_PROFILE U WHERE EMAIL =?;'


const GET_USER_PROFILE = async (req: RequestType, res: Response) => {
    const USER_EMAIL = req.user_email;
    const ALIAS_EMAIL = req.alias_email;


    if (!USER_EMAIL || !ALIAS_EMAIL) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [ALIAS_EMAIL, USER_EMAIL, USER_EMAIL, ALIAS_EMAIL, ALIAS_EMAIL]);
        if (result && result.length > 0) {
            res.send({ msg: "User Found", user: result[0], owner: req.allowAccountAccess });
        } else {
            res.status(200).send({ msg: "User not found", user: null });
        }
    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    } finally {
        connection?.release();
    }
};

export default GET_USER_PROFILE;
