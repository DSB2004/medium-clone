import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { REMOVE_BLOG_OWNERSHIP } from "../../utils/handle-blog-ownership";


const KEY_QUERY = 'DELETE FROM SEARCH_KEY WHERE BLOG_ID = ?';
const IMG_QUERY = 'DELETE FROM BLOG_IMAGES WHERE BLOG_ID = ?';
const COMMENT_QUERY = 'DELETE FROM BLOG_COMMENTS WHERE BLOG_ID=?';
const LIKE_QUERY = 'DELETE FROM BLOG_LIKES WHERE BLOG_ID=?';
const BLOG_QUERY = 'DELETE FROM BLOGS WHERE ID=?';

const DELETE_BLOG = async (req: RequestType, res: Response) => {

    const blog_id = req.req_blog;
    const user_email = req.user_email;

    if (!blog_id || !user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();

        await QUERY(connection, IMG_QUERY, [blog_id]);
        await QUERY(connection, KEY_QUERY, [blog_id]);
        await QUERY(connection, COMMENT_QUERY, [blog_id]);
        await QUERY(connection, LIKE_QUERY, [blog_id]);
        await QUERY(connection, BLOG_QUERY, [blog_id]);

        await REMOVE_BLOG_OWNERSHIP(user_email, blog_id);

        connection.commit();

        return res.send({ msg: "Blog removed" });

    } catch (err: any) {
        connection?.rollback();
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

export default DELETE_BLOG;