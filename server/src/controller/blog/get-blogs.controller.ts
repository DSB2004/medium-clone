import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";

const SEARCH_KEYS_QUERY = `
    SELECT BP.BLOG_ID, BP.INTRO_IMAGE, BP.HEADER, BP.SEARCH_KEYS, BP.INTRO, BP.USER_NAME, BP.LIKES,BP.SAVES, BP.COMMENTS,
    (SELECT EXISTS (SELECT 1 FROM BLOG_LIKES BL WHERE BL.USER_EMAIL = ? AND BL.BLOG_ID = BP.BLOG_ID)) AS "LIKED_BY_YOU",
    (SELECT EXISTS (SELECT 1 FROM BLOG_SAVES BS WHERE BS.USER_EMAIL = ? AND BS.BLOG_ID = BP.BLOG_ID)) AS "SAVED_BY_YOU"
    FROM BLOG_PROFILE BP 
    LEFT JOIN SEARCH_KEY S ON S.BLOG_ID = BP.BLOG_ID 
    WHERE S.SEARCH_KEY IN (?)
    LIMIT 10 OFFSET ?;
`;

const SIMPLE_QUERY = `
    SELECT BP.BLOG_ID, BP.HEADER, BP.INTRO, BP.INTRO_IMAGE, BP.USER_NAME, BP.LIKES, BP.COMMENTS, BP.SAVES,BP.SEARCH_KEYS, 
    (SELECT EXISTS (SELECT 1 FROM BLOG_LIKES BL WHERE BL.BLOG_ID = BP.BLOG_ID AND BL.USER_EMAIL = ?)) AS "LIKED_BY_YOU",
     (SELECT EXISTS (SELECT 1 FROM BLOG_SAVES BS WHERE BS.USER_EMAIL = ? AND BS.BLOG_ID = BP.BLOG_ID)) AS "SAVED_BY_YOU"
    FROM BLOG_PROFILE BP 
    LIMIT 10 OFFSET ?;
`;

const ALIAS_USER_EMAIL_QUERY = `
    SELECT BP.BLOG_ID, BP.HEADER, BP.INTRO_IMAGE, BP.INTRO, BP.USER_NAME, BP.LIKES, BP.COMMENTS,BP.SAVES, BP.SEARCH_KEYS, 
    (SELECT EXISTS (SELECT 1 FROM BLOG_LIKES BL WHERE BL.BLOG_ID = BP.BLOG_ID AND BL.USER_EMAIL = ?)) AS "LIKED_BY_YOU",
     (SELECT EXISTS (SELECT 1 FROM BLOG_SAVES BS WHERE BS.USER_EMAIL = ? AND BS.BLOG_ID = BP.BLOG_ID)) AS "SAVED_BY_YOU"
    FROM BLOG_PROFILE BP  
    WHERE BP.USER_EMAIL = ?  
    LIMIT 10 OFFSET ?;
`;

const GET_BLOGS = async (req: RequestType, res: Response) => {
    const USER_EMAIL = req.user_email;
    const URL_QUERY = req.query;
    const SEARCH_KEYS = URL_QUERY.keys;
    const ALIAS_USER_EMAIL = URL_QUERY['alias-user-email'];
    const OFFSET = Number(URL_QUERY.offset) ?? 0;

    let connection, result = null;

    if (OFFSET === undefined) {
        return res.status(400).send({ msg: "Offset is required", code: "ERR_FIELD_NOT_FOUND" });
    }

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);

        if (SEARCH_KEYS && Array.isArray(SEARCH_KEYS) && SEARCH_KEYS.length > 0) {

            result = await QUERY(connection, SEARCH_KEYS_QUERY, [USER_EMAIL, USER_EMAIL, SEARCH_KEYS, OFFSET]);
        } else if (ALIAS_USER_EMAIL) {
            result = await QUERY(connection, ALIAS_USER_EMAIL_QUERY, [USER_EMAIL, USER_EMAIL, ALIAS_USER_EMAIL, OFFSET]);
        } else {
            result = await QUERY(connection, SIMPLE_QUERY, [USER_EMAIL, USER_EMAIL, OFFSET]);
        }

        if (result && result.length > 0) {
            // @ts-ignore
            result.forEach(blog => {
                if (blog['SEARCH_KEYS']) {
                    blog['SEARCH_KEYS'] = blog['SEARCH_KEYS'].split(',');
                }
            });
        }
        return res.send({ msg: "Blogs", blogs: result });
    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        } else {
            console.log(err);
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" });
        }
    } finally {
        connection?.release();
    }
}

export default GET_BLOGS;
