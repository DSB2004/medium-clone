import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import { RequestType } from "../../types/index.types";

const SQL_QUERY = 'INSERT INTO FOLLOWERS (USER_EMAIL,FOLLOWER_EMAIL) VALUES (?,?)'

const ADD_FOLLOWING = async (req: RequestType, res: Response) => {

    const user_email = req.user_email;
    const alias_email = req.query['alias-email'];

    let connection;
    if (!user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    if (!alias_email) {
        return res.status(400).send({ msg: "Alias email not found", code: "ERR_FIELD_NOT_FOUND" });
    }
    if (user_email === alias_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        await QUERY(connection, SQL_QUERY, [alias_email, user_email]);
        res.send({ msg: `You are following ${alias_email}` });

    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === "ERR_DUPLICATE_VALUE") {
            return res.status(400).send({ msg: `You already follow ${alias_email}`, code: "ERR_ACCOUNT_EXIST" });
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

export default ADD_FOLLOWING;



