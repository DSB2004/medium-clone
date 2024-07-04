import { GET_CONNECTION, QUERY } from "../../utils/handle-connection"
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import DATABASE_INSTANCE from "../../database";

const SQL_QUERY = "DELETE FROM BLOG_LIKES WHERE USER_EMAIL=? AND BLOG_ID=?";

const REMOVE_LIKE = async (req: RequestType, res: Response) => {

    const user_email = req.user_email;
    const blog_id = req.query['blog-id'];

    if (!blog_id || !user_email) {
        return res.status(400).send({ msg: "Field not provided", code: "ERR_FIELD_NOT_FOUND" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        await QUERY(connection, SQL_QUERY, [user_email, blog_id]);
        return res.send({ msg: "Like removed" });

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


export default REMOVE_LIKE;