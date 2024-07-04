import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { GET_BLOG_OWNERSHIP, DELETE_USER_BLOG_OWNERSHIP } from "../../utils/handle-blog-ownership";
import { DELETE_USER_COMMENT_OWNERSHIP } from "../../utils/handle-comment-ownership"

// COMMENTS
const COMMENTS_BLOG_QUERY = "DELETE FROM BLOG_COMMENTS WHERE BLOG_ID IN (?);";
const COMMENTS_EMAIL_QUERY = 'DELETE FROM BLOG_COMMENTS WHERE USER_EMAIL =?;'
// BLOGS
const LIKE_BLOG_QUERY = "DELETE FROM BLOG_LIKES WHERE BLOG_ID IN (?);";

const LIKE_EMAIL_QUERY = "DELETE FROM BLOG_LIKES WHERE USER_EMAIL=?; ";
const SEARCH_KEYS_QUERY = "DELETE FROM SEARCH_KEY WHERE BLOG_ID IN (?);";
const IMAGES_QUERY = "DELETE FROM BLOG_IMAGES WHERE BLOG_ID IN (?);";
const BLOGS_QUERY = "DELETE FROM BLOGS WHERE ID IN (?);";

// FOLLOWERS
const FOLLOWERS_QUERY = "DELETE FROM FOLLOWERS WHERE USER_EMAIL=? OR FOLLOWER_EMAIL=?";

// USERS
const SOCIAL_LINK_QUERY = "DELETE FROM SOCIAL_LINKS WHERE USER_EMAIL=?";
const USER_SQL_QUERY = "DELETE FROM USERS WHERE EMAIL=?";

// AUTH
const AUTH_QUERY = "DELETE FROM AUTH WHERE EMAIL=?";

const DELETE_USER = async (req: RequestType, res: Response) => {

    const EMAIL = req.auth_email;
    // const EMAIL = 'alice@example.com'

    if (!EMAIL) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();
        const user_blog_array = await GET_BLOG_OWNERSHIP(EMAIL);
        await QUERY(connection, COMMENTS_EMAIL_QUERY, [EMAIL]);

        await QUERY(connection, LIKE_EMAIL_QUERY, [EMAIL]);

        if (user_blog_array.length > 0) {
            await QUERY(connection, COMMENTS_BLOG_QUERY, [user_blog_array]);

            await QUERY(connection, LIKE_BLOG_QUERY, [user_blog_array]);

            await QUERY(connection, SEARCH_KEYS_QUERY, [user_blog_array]);

            await QUERY(connection, IMAGES_QUERY, [user_blog_array]);

            await QUERY(connection, BLOGS_QUERY, [user_blog_array]);

        }
        await DELETE_USER_BLOG_OWNERSHIP(EMAIL);
        await DELETE_USER_COMMENT_OWNERSHIP(EMAIL);
        await QUERY(connection, FOLLOWERS_QUERY, [EMAIL, EMAIL]);
        await QUERY(connection, SOCIAL_LINK_QUERY, [EMAIL]);
        await QUERY(connection, USER_SQL_QUERY, [EMAIL]);
        await QUERY(connection, AUTH_QUERY, [EMAIL]);
        connection.commit()
        return res.status(200).send({ msg: "User deleted successfully" });
    }
    catch (err: any) {
        if (connection) {
            connection.rollback();
        }
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }
    finally {
        if (connection) {
            connection.release();
        }
    }




}

export default DELETE_USER;