import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { REMOVE_COMMENT_OWNERSHIP } from "../../utils/handle-comment-ownership";

const SQL_QUERY = 'DELETE FROM BLOG_COMMENTS WHERE ID = ?'

const REMOVE_COMMENT = async (req: RequestType, res: Response) => {
    const req_comment = req.headers['req-comment']
    const user_email = req.user_email;

    if (!user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    if (!req_comment || typeof (req_comment) !== 'string') {
        return res.status(400).send({ msg: "Fields are required", code: "ERR_FIELD_NOT_FOUND" })
    }
    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        await QUERY(connection, SQL_QUERY, [req_comment]);
        await REMOVE_COMMENT_OWNERSHIP(user_email, req_comment);
        return res.send({ msg: "Comment removed" });
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


}

export default REMOVE_COMMENT;