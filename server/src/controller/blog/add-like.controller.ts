import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";

const SQL_QUERY = "INSERT INTO BLOG_LIKES (BLOG_ID,USER_EMAIL) VALUES (?,?)";

const ADD_LIKE = async (req: RequestType, res: Response) => {

    const user_email = req.user_email;
    const blog_id = req.query["blog-id"];

    if (!blog_id || !user_email) {
        return res.status(400).send({ msg: "Field not provided", code: "ERR_FIELD_NOT_FOUND" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        await QUERY(connection, SQL_QUERY, [blog_id, user_email]);
        return res.send({ msg: "Like added" });

    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === "ERR_DUPLICATE_VALUE") {
            return res.status(400).send({ msg: `You already liked this blog`, code: "ERR_ACCOUNT_EXIST" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    } finally {
        connection?.release();
    }

}


export default ADD_LIKE;