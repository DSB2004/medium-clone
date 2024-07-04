import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response, Request } from "express";
import { GENERATE_ID } from "../../utils/handle-id";
import { ADD_COMMENT_OWNERSHIP } from "../../utils/handle-comment-ownership";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";


const SQL_QUERY = 'INSERT INTO BLOG_COMMENTS (ID, USER_EMAIL, BLOG_ID, BODY) VALUES (?,?,?,?)';


const ADD_COMMENT = async (req: RequestType, res: Response) => {
    const BODY = req.body;

    const user_email = req.user_email;
    const blog_id = req.query['blog-id']

    if (!user_email || !blog_id || typeof (user_email) !== 'string' || typeof (blog_id) !== 'string') {
        return res.status(400).send({ msg: "Fields are required", code: "ERR_FIELD_NOT_FOUND" })
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const ID = GENERATE_ID();
        await QUERY(connection, SQL_QUERY, [ID, user_email, blog_id, BODY.BODY]);
        await ADD_COMMENT_OWNERSHIP(user_email, blog_id);
        return res.send({ msg: "Comment added", COMMENT_ID: ID });

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

export default ADD_COMMENT;