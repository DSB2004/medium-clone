import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";

const SQL_QUERY = 'DELETE FROM FOLLOWERS WHERE USER_EMAIL= ? AND FOLLOWER_EMAIL=?'

const REMOVE_FOLLOWING = async (req: RequestType, res: Response) => {
    const user_email = req.user_email;
    const alias_email = req.query['alias-email'];

    let connection;
    if (!user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    if (!alias_email) {
        return res.status(400).send({ msg: "Alias email not found", code: "ERR_FIELD_NOT_FOUND" });
    }
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        await QUERY(connection, SQL_QUERY, [alias_email, user_email]);
        res.send({ msg: `You unfollowed ${alias_email}` });

    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }

    finally {
        connection?.release();
    }

};


export default REMOVE_FOLLOWING;