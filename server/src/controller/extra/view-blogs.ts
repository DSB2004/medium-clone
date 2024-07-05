import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";

const SIMPLE_QUERY = `
    SELECT BP.BLOG_ID, BP.HEADER, BP.INTRO, BP.INTRO_IMAGE, BP.USER_NAME, BP.LIKES, BP.COMMENTS, BP.SAVES, BP.SEARCH_KEYS
    FROM BLOG_PROFILE BP 
    LIMIT 10 OFFSET ?;
`;


const VIEW_BLOGS = async (req: RequestType, res: Response) => {
    const URL_QUERY = req.query;
    const OFFSET = Number(URL_QUERY.offset) ?? 0;

    let connection, result = null;

    if (OFFSET === undefined) {
        return res.status(400).send({ msg: "Offset is required", code: "ERR_FIELD_NOT_FOUND" });
    }
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        result = await QUERY(connection, SIMPLE_QUERY, [OFFSET]);

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

export default VIEW_BLOGS;
