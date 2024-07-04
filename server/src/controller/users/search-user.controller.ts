import { Request, Response } from "express";

import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";


const SQL_QUERY = 'SELECT NAME, EMAIL, PROFILE_PIC FROM USER_PROFILE WHERE UPPER(SUBSTR(NAME, 1, LENGTH(?))) = UPPER(?)';


const SEARCH_USERS = async (req: Request, res: Response) => {

    const URL_QUERY = req.query;
    const NAME = URL_QUERY.NAME;
    
    let connection;
    if (!NAME) {
        return res.status(400).send({ msg: "Name not provided", code: "ERR_FIELD_NOT_FOUND" })
    }
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [NAME, NAME]);
        if (result && result.length > 0) {
            res.send({ msg: "Users Found", users: result })
        } else {
            res.status(200).send({ msg: "No user found", users: [] })
        }
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

export default SEARCH_USERS;

