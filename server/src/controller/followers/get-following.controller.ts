import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";

const SQL_QUERY = "SELECT * FROM FOLLOWED_BY_USER WHERE USER_EMAIL=?";


const GET_FOLLOWING = async (req: RequestType, res: Response) => {
    const user_email = req.user_email;

    if (!user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    
    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [user_email]);
        res.send({ msg: "Followed by You", users: result });

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

}

export default GET_FOLLOWING;