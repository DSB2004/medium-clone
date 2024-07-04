import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { HASH_PASSWORD } from "../../utils/handle-password"
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { RequestType } from "../../types/index.types";

const SQL_QUERY = 'UPDATE AUTH SET PASSWORD = ? WHERE EMAIL=?;'


const RESET_PASSWORD = async (req: RequestType, res: Response) => {
    const BODY = req.body;
    const PASSWORD = BODY.PASSWORD;

    const EMAIL = req.auth_email;

    if (!EMAIL) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    if (!PASSWORD) {
        return res.status(400).send({ msg: "Field are missing", code: "ERR_FIELD_NOT_FOUND" });
    }
    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const HASHED_PASSWORD = await HASH_PASSWORD(PASSWORD);
        await QUERY(connection, SQL_QUERY, [HASHED_PASSWORD, EMAIL]);
        return res.send({ msg: "User password updated" });
    }
    catch (err) {
        console.log(err)
        if (connection) {
            return res.status(500).send({ msg: "Unable to reset password", code: "ERR_DATABASE_QUERY" });
        }
        else {
            return res.status(500).send({ msg: "Unable to reset password", code: "ERR_DATABASE_CONNECTION" });
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


export default RESET_PASSWORD;