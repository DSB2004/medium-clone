import { GET_CONNECTION, QUERY } from "../../utils/handle-connection"
import { Response, Request } from "express";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";


const SQL_QUERY = 'SELECT * FROM BLOG_COMMENTS WHERE BLOG_ID = ?';

const GET_COMMENTS = async (req: RequestType, res: Response) => {

    const blog_id = req.query["blog-id"];
    const user_email = req.user_email;

    if (!user_email || !blog_id) {
        console.log(user_email, blog_id)
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [blog_id]);
        return res.send({ msg: "Blog comments", result });
    } catch (err) {
        console.log(err)
        if (connection) {
            return res.status(500).send({ msg: "Unable to get comments", errCode: "ERR_DATABASE_QUERY" });
        }
        else {
            return res.status(500).send({ msg: "Unable to get comments", errCode: "ERR_DATABASE_CONNECTION" });
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }


}

export default GET_COMMENTS;